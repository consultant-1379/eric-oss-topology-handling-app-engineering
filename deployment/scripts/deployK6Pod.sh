#!/bin/bash
KUBECONFIG="$1"
NAMESPACE="$2"
BUILD_URL="$3"
SEF_STATUS="$4"

TH_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.th' --raw-output`"
IAM_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.iam' --raw-output`"
EIC_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.eic' --raw-output`"
GAS_HOSTNAME="`helm get values eric-topology-handling --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} -o json | jq '.global.hosts.gas' --raw-output`"
TH_URL=https://${TH_HOSTNAME}
IAM_URL=https://${IAM_HOSTNAME}
EIC_URL=https://${EIC_HOSTNAME}
GAS_URL=https://${GAS_HOSTNAME}

APP_VERSION=`helm list --kubeconfig ${KUBECONFIG} -n ${NAMESPACE} --filter eric-topology-handling -o json | jq -r '.[0].chart' | cut -d '-' -f4`

if helm repo list | grep -q "^testware-repository\s"; then
    echo "Repository testware-repository already exists. Updating..."
    helm repo update testware-repository
else
    echo "Repository testware-repository does not exist. Adding..."
    helm repo add testware-repository https://arm.seli.gic.ericsson.se/artifactory/proj-eric-oss-drop-helm-local --username testautoci --password '&SmgE!!RJ87joL7T'
fi

helm install eric-oss-th-app-engineering testware-repository/eric-oss-topology-handling-app-test \
    -n ${NAMESPACE} \
    --kubeconfig ${KUBECONFIG} \
    --set env.BUILD_URL=${BUILD_URL} \
    --set env.APP_VERSION=${APP_VERSION} \
    --set env.hostname_url=${TH_URL} \
    --set env.IAM_HOST=${IAM_URL} \
    --set env.EIC_HOST=${EIC_URL} \
    --set env.GAS_HOST=${GAS_URL} \
    --set env.SEF_STATUS=${SEF_STATUS}

echo TH hostname: ${TH_HOSTNAME}
All_PODS=`kubectl get pods --namespace ${NAMESPACE}`
echo "$All_PODS"
sleep 90
kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs topology-handling-k6-testsuite
