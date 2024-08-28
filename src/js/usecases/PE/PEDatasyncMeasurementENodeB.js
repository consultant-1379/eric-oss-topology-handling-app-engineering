import * as http from "../../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../../modules/k6extra/check.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { errorCounter } from '../../main.js';
import { addTagToHeaders } from "../../utility/auth.js";
import { CREATE_DATASYNC_TAG, DELETE_DATASYNC_TAG, Datasync_URL } from "../../utility/constants.js";

export default function (params) {
    group('Using Datasync API Simulate Client Topology CREATE requests in CTS for the ENODEB then DELETE the cells', function () {
        group('Create then Delete ENODEB', function () {
            let res;
            const randomID = randomString(32);
            const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
            const data = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb01"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb02",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb02",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb02"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb03",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb03"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "reconcile",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb04",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb04"
                        }
                    ]
                }
            });

            const request = http.post(Datasync_URL, data, addTagToHeaders(params, CREATE_DATASYNC_TAG));
            res = check(request, {
                'Verify ENODEB Create API call and Status should be 200': (r) => r.status === 200
            }, { type: 'ENODEB create' });
            if (request.status != 200) console.log("ENODEB Create Status is ", request.status);
            if (!res) errorCounter.add(1);

            const deleteData = JSON.stringify({
                "type": "osl-adv\/datasyncservice\/process",
                "jsonHolder": {
                    "type": "gs\/jsonHolder",
                    "json": [
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb01"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb02",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb02",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb02"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb03",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb03",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb03"
                        },
                        {
                            "$type": "ctw/eNodeB",
                            "$action": "delete",
                            "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb04",
                            "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb04",
                            "status": "operating",
                            "name": randomDNPrefix + "/managedelement01/enodeb04"
                        }
                    ]
                }
            });

            const deleteRequest = http.post(Datasync_URL, deleteData, addTagToHeaders(params, DELETE_DATASYNC_TAG));
            res = check(deleteRequest, {
                'Verify ENODEB Delete API call and Status should be 200': (r) => r.status === 200,
            }, { type: 'ENODEB delete' });
            if (deleteRequest.status != 200) console.log("ENODEB Delete Status is ", deleteRequest.status);
            if (!res) errorCounter.add(1);
        })
    });
}
