#!/bin/bash
KUBECONFIG=$1
NAMESPACE=$2
REPORT_PATH=$3

retries="260";

k6pod_name=$(kubectl get pod -n $NAMESPACE -l app=topology-handling-k6 -o=jsonpath="{range .items[*]}{.metadata.name}")

while [ $retries -ge 0 ]
do
    k6pod_status=$(kubectl get pods -n $NAMESPACE -o=jsonpath="{.items[?(@.metadata.name == '$k6pod_name')].status.phase}")
    kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} cp topology-handling-k6-testsuite:/reports/summary.json ${REPORT_PATH}/summary.json > /dev/null
    kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} logs topology-handling-k6-testsuite > ${REPORT_PATH}/topology-handling-k6-testsuite.log
    kubectl --namespace ${NAMESPACE} --kubeconfig ${KUBECONFIG} cp topology-handling-k6-testsuite:/reports/TopologyHandling_HtmlReport.html ${REPORT_PATH}/TopologyHandling_HtmlReport.html > /dev/null
    if [[ "$retries" -eq "0" ]]
    then
        echo no report file available
        exit 1
    elif [[ -f ${REPORT_PATH}/summary.json ]] || [[ "$k6pod_status" =~ (Succeeded|Failed) ]]
    then
        echo report copied or test pod status is completed
        break
    else
        let "retries-=1"
        echo report not available, Retries left = $retries :: Sleeping for 15 seconds
        sleep 15
    fi
done
