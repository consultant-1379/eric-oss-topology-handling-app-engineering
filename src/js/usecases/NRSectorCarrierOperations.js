import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { generateNRSectorCarrierPayload } from '../PayloadGenerators.js';
import { addTagToHeaders } from "../utility/auth.js"
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { CREATE_TAG, READ_TAG, UPDATE_TAG, DELETE_TAG, NRSECTORCARRIER_URL } from "../utility/constants.js";

export function CreateNRSectorCarrier(params) {
    let resp
    group('Using NRSECTORCARRIER API Simulate Client Topology CREATE request in CTS for the NRSECTORCARRIER', function () {
        group('Create NRSECTORCARRIER', function () {
            let res;
            const data = generateNRSectorCarrierPayload();
            resp = http.post(NRSECTORCARRIER_URL, data, addTagToHeaders(params, CREATE_TAG));
            res = check(resp, {
                'Verify NRSECTORCARRIER Create API call and Status should be 201': (r) => r.status === 201
            }, { type: 'NRSectorCarrier create' });
            if (resp.status != 201) console.log("NRSECTORCARRIER Create response Status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
    return resp.json('id')
}

export function ReadNRSectorCarrier(cellID, params) {
    group('Using NRSECTORCARRIER API Simulate Client Topology GET request in CTS for the NRSECTORCARRIER', function () {
        group('Get NRSECTORCARRIER', function () {
            let res;
            const resp = http.get(NRSECTORCARRIER_URL + "/" + cellID, addTagToHeaders(params, READ_TAG));
            res = check(resp, {
                'Verify NRSECTORCARRIER API call and Status should be 200': (r) => r.status === 200
            }, { type: 'NRSectorCarrier read' });
            if (resp.status != 200) console.log("NRSECTORCARRIER GET Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function UpdateNRSectorCarrier(cellID, params) {
    const randomARFCNDL = randomIntBetween(1, 100);
    group('Using NRSECTORCARRIER API Simulate Client Topology UPDATE request in CTS for the NRSECTORCARRIER', function () {
        group('Update NRSECTORCARRIER', function () {
            let res;
            const putData = JSON.stringify({
                "type": "ctw/nrsectorcarrier",
                "arfcnDL": randomARFCNDL,
            });
            const resp = http.put(NRSECTORCARRIER_URL + "/" + cellID, putData, addTagToHeaders(params, UPDATE_TAG));
            res = check(resp, {
                'Verify NRSECTORCARRIER Update API call and Status should be 204': (r) => r.status === 204
            }, { type: 'NRSectorCarrier update' });
            if (resp.status != 204) console.log("NRSECTORCARRIER Update response Status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function DeleteNRSectorCarrier(cellID, params) {
    group('Using NRSECTORCARRIER API Simulate Client Topology DELETE request in CTS for the NRSECTORCARRIER', function () {
        group('Delete NRSECTORCARRIER', function () {
            let res;
            const resp = http.del(NRSECTORCARRIER_URL + "/" + cellID, null, addTagToHeaders(params, DELETE_TAG));
            res = check(resp, {
                'Verify NRSECTORCARRIER API call and Status should be 204': (r) => r.status === 204
            }, { type: 'NRSectorCarrier delete' });
            if (resp.status != 204) console.log("NRSECTORCARRIER Delete Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}
