import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { generateNRCellPayload } from '../PayloadGenerators.js';
import { addTagToHeaders } from "../utility/auth.js"
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { CREATE_TAG, READ_TAG, UPDATE_TAG, DELETE_TAG, NRCELL_URL } from "../utility/constants.js";

export function CreateNRCell(params) {
    let resp
    group('Using NRCELL API Simulate Client Topology CREATE request in CTS for the NRCELL', function () {
        group('Create NRCELL', function () {
            let res;
            const data = generateNRCellPayload();
            resp = http.post(NRCELL_URL, data, addTagToHeaders(params, CREATE_TAG));
            res = check(resp, {
                'Verify NRCELL Create API call and Status should be 201': (r) => r.status === 201
            }, { type: 'NRCell create' });
            if (resp.status != 201) console.log("NRCELL Create Status is ", resp.status);
            if (!res) {
                errorCounter.add(1);
            }
        })
    });
    return resp.json('id')
}

export function ReadNRCell(cellID, params) {
    group('Using NRCELL API Simulate Client Topology GET request in CTS for the NRCELL', function () {
        group('Get NRCELL', function () {
            let res;
            const resp = http.get(NRCELL_URL + "/" + cellID, addTagToHeaders(params, READ_TAG));
            res = check(resp, {
                'Verify NRCELL API call and Status should be 200': (r) => r.status === 200
            }, { type: 'NRCell read' });
            if (resp.status != 200) console.log("NRCELL GET Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function UpdateNRCell(cellID, params) {
    const randomTrackingAreaCode = randomIntBetween(1, 1000000);
    group('Using NRCELL API Simulate Client Topology UPDATE request in CTS for the NRCELL', function () {
        group('Update NRCELL', function () {
            let res;
            const putData = JSON.stringify({
                "type": "ctw/nrcell",
                "trackingAreaCode": randomTrackingAreaCode
            });
            const resp = http.put(NRCELL_URL + "/" + cellID, putData, addTagToHeaders(params, UPDATE_TAG));
            res = check(resp, {
                'Verify NRCELL Update API call and Status should be 204': (r) => r.status === 204
            }, { type: 'NRCell update' });
            if (resp.status != 204) console.log("NRCELL Update response Status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function DeleteNRCell(cellID, params) {
    group('Using NRCELL API Simulate Client Topology DELETE request in CTS for the NRCELL', function () {
        group('Delete NRCELL', function () {
            let res;
            const resp = http.del(NRCELL_URL + "/" + cellID, null, addTagToHeaders(params, DELETE_TAG));
            res = check(resp, {
                'Verify NRCELL API call and Status should be 204': (r) => r.status === 204
            }, { type: 'NRCell delete' });
            if (resp.status != 204) console.log("NRCELL Delete Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}
