#!/bin/bash

KUBECONFIG="$1"
NAMESPACE="$2"

echo "Cleaning up K6 run..."

helm del -n ${NAMESPACE} --kubeconfig ${KUBECONFIG} eric-oss-th-app-engineering

echo "Cleanup finished."
