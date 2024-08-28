#!/bin/bash
KUBECONFIG=$1
NAMESPACE=$2
SEF_STATUS=$3

TH_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.th' --raw-output`"
IAM_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.iam' --raw-output`"
EIC_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.eic' --raw-output`"
GAS_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.gas' --raw-output`"

kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} delete pod topology-handling-k6-testsuite
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} delete configmap th-k6-configmap testware-hostnames testware-global-config

# if SEF disabled (false), then iam=IAM_HOSTNAME and there is no EIC
# if SEF enabled (true), then iam=EIC_HOSTNAME and eic=EIC_HOSTNAME
# in URI no protocol allowed as this is how testware-hostnames configmap managed on pipelines
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} create configmap testware-hostnames \
  --from-literal=th=${TH_HOSTNAME} \
  --from-literal=gas=${GAS_HOSTNAME} \
  --from-literal=iam=${IAM_HOSTNAME}
if [[ $SEF_STATUS = "enabled" || $SEF_STATUS = "true" ]]; then SEF_ENABLED="true"; else SEF_ENABLED="false"; fi
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} create configmap testware-global-config --from-literal=sef-enabled=${SEF_ENABLED}

kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} create configmap th-k6-configmap \
  --from-literal=hostname_url=${TH_HOSTNAME} \
  --from-literal=IAM_HOST=${IAM_HOSTNAME} \
  --from-literal=EIC_HOST=${EIC_HOSTNAME} \
  --from-literal=GAS_HOST=${GAS_HOSTNAME} \
  --from-literal=SEF_STATUS=${SEF_STATUS} \
  --from-file=th-test=./src/js/main.js \
  --from-file=th-PayloadGenerators=./src/js/PayloadGenerators.js \
  --from-file=th-CommonTopologyUIRestCalls=./src/js/usecases/CommonTopologyUIRestCalls.js \
  --from-file=th-ngcorenetfunction=./src/js/usecases/legacy/ngcorenetfunction.js \
  --from-file=th-FiveQIFlowService=./src/js/usecases/legacy/FiveQIFlowService.js \
  --from-file=th-FiveQISetService=./src/js/usecases/legacy/FiveQISetService.js \
  --from-file=th-nrf=./src/js/usecases/legacy/nrf.js \
  --from-file=th-smf=./src/js/usecases/legacy/smf.js \
  --from-file=run-k6=./deployment/scripts/runK6TH.sh \
  --from-file=th-LTECellOperations=./src/js/usecases/LTECellOperations.js \
  --from-file=th-NRCellAssociatedWithGNBDURead=./src/js/usecases/NRCellAssociatedWithGNBDURead.js \
  --from-file=th-NRCellOperations=./src/js/usecases/NRCellOperations.js \
  --from-file=th-NRSectorCarrierAssociatedWithNRCellRead=./src/js/usecases/NRSectorCarrierAssociatedWithNRCellRead.js \
  --from-file=th-NRSectorCarrierOperations=./src/js/usecases/NRSectorCarrierOperations.js \
  --from-file=th-DatasyncOperations=./src/js/usecases/DatasyncOperations.js \
  --from-file=th-PEDatasyncMeasurementENodeB=./src/js/usecases/PE/PEDatasyncMeasurementENodeB.js \
  --from-file=th-PEDatasyncMeasurementGNBCUCP=./src/js/usecases/PE/PEDatasyncMeasurementGNBCUCP.js \
  --from-file=th-PEDatasyncMeasurementGNBCUUP=./src/js/usecases/PE/PEDatasyncMeasurementGNBCUUP.js \
  --from-file=th-PEDatasyncMeasurementGNBDU=./src/js/usecases/PE/PEDatasyncMeasurementGNBDU.js \
  --from-file=th-sanityCheckingAPIGW=./src/js/usecases/sanityCheckingAPIGW.js \
  --from-file=th-setup=./src/js/usecases/setup.js \
  --from-file=th-scrapepools=./src/js/usecases/CheckScrapePoolsStatus.js \
  --from-file=th-module-http=./src/js/modules/k6extra/http.js \
  --from-file=th-module-check=./src/js/modules/k6extra/check.js \
  --from-file=th-module-log=./src/js/modules/k6extra/log.js \
  --from-file=th-module-triggerCTSInit=./src/js/modules/triggerCTSInit.js \
  --from-file=th-utility-auth=./src/js/utility/auth.js \
  --from-file=th-utility-constants=src/js/utility/constants.js \
  --from-file=th-defaultoptions=./src/resources/config/default.options.json


kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} apply -f deployment/chart/network-policy/eric-topology-handling-eai-k6-policy.yaml;
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} apply -f deployment/chart/network-policy/eric-topology-handling-eai-k6-sef-policy.yaml;
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} apply -f deployment/chart/topology-handling-k6Pod-local.yaml;

sleep 30
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs topology-handling-k6-testsuite
