import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { addTagToHeaders } from "../utility/auth.js";
import { CREATE_DATASYNC_TAG, DELETE_DATASYNC_TAG, Datasync_URL, ENODEB, GNBDU, GNBCUCP, GNBCUUP } from "../utility/constants.js";
import { GNBDUPayload, ENODEBPayload, GNBCUUPPayload, GNBCUCPPayload } from "../PayloadGenerators.js"

export function Create(params, type, id, dn) {
    group('Using Datasync API Simulate Client Topology CREATE requests in CTS for ' + type, function () {
        let res
        let data

        switch (type) {
            case ENODEB:
                data = ENODEBPayload('reconcile', id, dn)
                break
            case GNBDU:
                data = GNBDUPayload('reconcile', id, dn)
                break
            case GNBCUCP:
                data = GNBCUCPPayload('reconcile', id, dn)
                break
            case GNBCUUP:
                data = GNBCUUPPayload('reconcile', id, dn)
                break
            default:
                return
        }

        const resp = http.post(Datasync_URL, data, addTagToHeaders(params, CREATE_DATASYNC_TAG))
        res = check(resp, {
            "Verify Create Datasync API call and Status should be 200": (r) => r.status === 200
        }, { type: type + ' create' })

        if (resp.status != 200) console.log("Datasync Create Status is ", resp.status)
        if (!res) errorCounter.add(1)
    })
}

export function Delete(params, type, id, dn) {
    group('Using Datasync API Simulate Client Topology DELETE requests in CTS for the ' + type, function () {
        let res
        let deleteData

        switch (type) {
            case ENODEB:
                deleteData = ENODEBPayload('delete', id, dn)
                break
            case GNBDU:
                deleteData = GNBDUPayload('delete', id, dn)
                break
            case GNBCUCP:
                deleteData = GNBCUCPPayload('delete', id, dn)
                break
            case GNBCUUP:
                deleteData = GNBCUUPPayload('delete', id, dn)
                break
            default:
                return
        }

        const deleteResp = http.post(Datasync_URL, deleteData, addTagToHeaders(params, DELETE_DATASYNC_TAG))
        res = check(deleteResp, {
            'Verify Delete Datasync API call and Status should be 200': (r) => r.status === 200,
        }, { type: type + ' delete' })

        if (deleteResp.status != 200) console.log("Datasync Delete Status is ", deleteResp.status)
        if (!res) errorCounter.add(1)
    });
}
