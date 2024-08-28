import * as http from "../../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../../modules/k6extra/check.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { errorCounter } from '../../main.js';
import { addTagToHeaders } from "../../utility/auth.js";
import { CREATE_DATASYNC_TAG, DELETE_DATASYNC_TAG, Datasync_URL } from "../../utility/constants.js";

export default function (params) {
    group('Using Datasync API Simulate Client Topology CREATE requests in CTS for the GNBCUUP then DELETE the cells', function () {
        group('Create GNBCUUP', function () {
            let res;
            const randomID = randomString(32);
            const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
            const data = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup02"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup03",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup03"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup04",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup04"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup05",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup05",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup05"
                        }
                    ]
                }
            })

            const request = http.post(Datasync_URL, data, addTagToHeaders(params, CREATE_DATASYNC_TAG));
            res = check(request, {
                'Verify GNBCUUP Create API call and Status should be 200': (r) => r.status === 200
            }, { type: 'GNBCUUP create' });
            if (request.status != 200) console.log("GNBCUUP Create Status is ", request.status);
            if (!res) errorCounter.add(1);

            const deleteData = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup02"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup03",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup03"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup04",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup04"
                        },
                        {
                            "$type": "ctw/gnbcuup",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup05",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup05",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbcuup05"
                        }
                    ]
                }
            });

            const deleteRequest = http.post(Datasync_URL, deleteData, addTagToHeaders(params, DELETE_DATASYNC_TAG));
            res = check(deleteRequest, {
                'Verify GNBCUUP Delete API call and Status should be 200': (r) => r.status === 200,
            }, { type: 'GNBCUUP delete' });
            if (deleteRequest.status != 200) console.log("GNBCUUP Delete Status is ", deleteRequest.status);
            if (!res) errorCounter.add(1);
        })
    });
}
