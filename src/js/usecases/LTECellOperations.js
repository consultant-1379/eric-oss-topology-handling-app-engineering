import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { generateLTECellPayload } from '../PayloadGenerators.js';
import { addTagToHeaders } from "../utility/auth.js"
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { CREATE_TAG, READ_TAG, UPDATE_TAG, DELETE_TAG, LTE_URL } from "../utility/constants.js";

export function CreateLTECell(params) {
    let resp
    group('Using LTECELL API Simulate Client Topology CREATE request in CTS for the LTECELL', function () {
        group('Create LTECELL', function () {
            let res;
            const data = generateLTECellPayload();
            resp = http.post(LTE_URL, data, addTagToHeaders(params, CREATE_TAG));
            res = check(resp, {
                'Verify LTECELL Create API call and Status should be 201': (r) => r.status === 201
            }, { type: 'LTECell create' });
            if (resp.status != 201) console.log("LTECELL Create Status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
    return resp.json('id')
}

export function ReadLTECell(cellID, params) {
    group('Using LTECELL API Simulate Client Topology GET request in CTS for the LTECELL', function () {
        group('Get LTECELL', function () {
            let res;
            const resp = http.get(LTE_URL + "/" + cellID, addTagToHeaders(params, READ_TAG));
            res = check(resp, {
                'Verify LTECELL API call and Status should be 200': (r) => r.status === 200
            }, { type: 'LTECell read' });
            if (resp.status != 200) console.log("LTECELL GET Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function UpdateLTECell(cellID, params) {
    const randomFDDearfcnDl = randomIntBetween(1, 100);
    group('Using LTECELL API Simulate Client Topology UPDATE request in CTS for the LTECELL', function () {
        group('Update LTECELL', function () {
            let res;
            const putData = JSON.stringify({
                "type": "ctw/ltecell",
                "FDDearfcnDl": randomFDDearfcnDl
            });
            const resp = http.put(LTE_URL + "/" + cellID, putData, addTagToHeaders(params, UPDATE_TAG));
            res = check(resp, {
                'Verify LTECELL Update API call and Status should be 204': (r) => r.status === 204
            }, { type: 'LTECell update' });
            if (resp.status != 204) console.log("LTECELL Update response Status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}

export function DeleteLTECell(cellID, params) {
    group('Using LTECELL API Simulate Client Topology DELETE request in CTS for the LTECELL', function () {
        group('Delete LTECELL', function () {
            let res;
            const resp = http.del(LTE_URL + "/" + cellID, null, addTagToHeaders(params, DELETE_TAG));
            res = check(resp, {
                'Verify LTECELL API call and Status should be 204': (r) => r.status === 204
            }, { type: 'LTECell delete' });
            if (resp.status != 204) console.log("LTECELL Delete Request response status is ", resp.status);
            if (!res) errorCounter.add(1);
        })
    });
}
