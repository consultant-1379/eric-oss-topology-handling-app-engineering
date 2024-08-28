import * as http from "../../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../../modules/k6extra/check.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { errorCounter } from '../../main.js';
import { addTagToHeaders } from '../../utility/auth.js'
import { CREATE_DATASYNC_TAG, DELETE_DATASYNC_TAG, Datasync_URL } from "../../utility/constants.js";

export default function (params) {
    group('Using Datasync API Simulate Client Topology CREATE request in CTS for the GNBDU then DELETE the cells', function () {
        group('Create GNBDU', function () {
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

            const request = http.post(Datasync_URL, data, addTagToHeaders(params, CREATE_DATASYNC_TAG));
            res = check(request, {
                'Verify GNBDU Create API call and Status should be 200': (r) => r.status === 200
            }, { type: 'GNBDU create' });
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
            const deleteRequest = http.post(Datasync_URL, deleteData, addTagToHeaders(params, DELETE_DATASYNC_TAG));
            res = check(deleteRequest, {
                'Verify GNBDU Delete API call and Status should be 200': (r) => r.status === 200,
            }, { type: 'GNBDU delete' });
            if (deleteRequest.status != 200) console.log("GNBDU Delete Status is ", deleteRequest.status);
            if (!res) errorCounter.add(1);
        })
    });
}
