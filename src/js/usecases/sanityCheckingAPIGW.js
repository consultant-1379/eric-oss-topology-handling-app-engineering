import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { group } from 'k6';
import * as http from "../modules/k6extra/http.js";
import check from "../modules/k6extra/check.js";
import { API_GW_URL } from "../utility/constants.js";
import { errorCounter } from '../main.js';

const URL_Datasync = API_GW_URL.concat("/oss-core-ws/rest/osl-adv/datasync/process");

export default function (params) {
    group('Using Datasync API to sanity test API Gateway', function () {
        group('API GW sanity via Create GNBDU', function () {
            console.log("API GW sanity test URL_Datasync: " + URL_Datasync)
            let res;
            const randomID = randomString(32);
            const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
            const data = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu03"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu04"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu05",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu05",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu05"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu06",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu06",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu06"
                        }
                    ]
                }
            })

            const request = http.post(URL_Datasync, data, params);
            res = check(request, {
                'Verify API Gateway sanity via GNBDU Create API call and Status should be 200': (r) => r.status === 200
            });
            if (request.status != 200) console.log("GNBDU Create Status is ", request.status);
            if (!res) errorCounter.add(1);

            const deleteData = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu03"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu04"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu05",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu05",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu05"
                        },
                        {
                            "$type": "ctw/gnbdu",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu06",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu06",
                            "status": "operating",
                            "name": randomDNPrefix + "/me04/gnbdu06"
                        }
                    ]
                }
            });
            const deleteRequest = http.post(URL_Datasync, deleteData, params);
            res = check(deleteRequest, {
                'Verify API Gateway sanity via GNBDU Delete API call and Status should be 200': (r) => r.status === 200,
            });
            if (deleteRequest.status != 200) console.log("GNBDU Delete Status is ", deleteRequest.status);
            if (!res) errorCounter.add(1);
        })
    });
}
