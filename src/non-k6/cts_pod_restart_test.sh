#!/usr/bin/env bash

# Description:
#   Automatic test to verify that the CTS can fully restart after pod deletion.
# Parameters:
#   1: K8s namespace in which the CTS is in
#   2: hostname of the gateway at which the service is available in
#   3: hostname of Identity and Access Management Service (IAM)
#   4: id of that client which has role for access to `oss-core-ws/rest/ctw/nrcell` endpoint
#   5: secret of the client which id equals to 4th parameter
# Steps:
#   1, Login to CTS - to be able to use CTS REST API
#   2, Verify CTS is working
#      + Send REST API call to CTS
#        * Expect normal HTTP 2xx response
#   3, Delete CTS pods
#      + Check service outage to verify successful disruption
#   4, Wait until service is restored or fail after threshold
#      + Periodically send REST API call to CTS
#        * End test if upon receiving normal HTTP 2xx response
#        * End test if service is not restored after threshold


CTS_NAMESPACE=$1
GAS_HOST=$2
IAM_HOST=$3
CLIENT_ID=$4 # th_k6_client
CLIENT_SECRET=$5

CTS_APP_LABEL=eric-oss-cmn-topology-svc-core

start_login_session() {
    curl -sk -XPOST https://${IAM_HOST}/auth/realms/master/protocol/openid-connect/token \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "client_id=${CLIENT_ID}" \
    --data-urlencode "client_secret=${CLIENT_SECRET}" \
    --data-urlencode 'tenant=master' \
    --data-urlencode 'grant_type=client_credentials' --fail | jq -r '.access_token'
}

is_service_working() {
    KEYCLOAK_TOKEN="Bearer `start_login_session`"
    RESP_CODE="`curl -kqsw '%{http_code}' https://${GAS_HOST}/oss-core-ws/rest/ctw/nrcell --header "Authorization: $KEYCLOAK_TOKEN" --fail --output /dev/null`"
    error_on_check="$?"
    echo "Response code from service: $RESP_CODE."
    test 0 -eq "$error_on_check" && echo "Service is working." || echo "Service is not working."
    return $error_on_check
}

login() {
    KEYCLOAK_TOKEN=`start_login_session`
    error_on_login="$?"
    test 0 -eq "$error_on_login" || { echo "Could not login. Error $error_on_login" ; return "$error_on_login"; }
    echo "Successful login."
    return $error_on_login
}

verify_outage(){
    is_service_working "$KEYCLOAK_TOKEN" && { echo "Service disruption failed. Service still works after pod deletion. TEST FAILED."; return 11; }

    echo "Service is inoperable as expected."
    return 0
}


### ENTRYPOINT

echo "...Starting test..."
echo "...Logging in..."
login || exit $?
echo "...Checking if service is working before test run..."
is_service_working "$KEYCLOAK_TOKEN" || { echo "Could not assert that the service is in a healthy state before test run. TEST FAILED." ; exit 22 ; }

echo "...Deleting pods..."
kubectl delete po -n $CTS_NAMESPACE -l app="$CTS_APP_LABEL"

echo "...Verifying service outage..."
verify_outage || exit $?

echo "...Waiting maximum 60 checks (5 minutes) for service to restore..."
for i in `seq 1 60`; do
    echo "Service availability check: ${i}..."
    is_service_working "$KEYCLOAK_TOKEN" && { echo "Service restored. TEST SUCCESSFUL."; exit 0; }
    sleep 5
done

echo "SERVICE DID NOT RESTART IN TIME. Manual investigation and fix is needed. TEST FAILED."
exit 1
