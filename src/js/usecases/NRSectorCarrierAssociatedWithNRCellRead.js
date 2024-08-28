import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { addTagToHeaders } from "../utility/auth.js"
import { QUERY_TAG, NRCELL_URL } from "../utility/constants.js";

export default function (cellID, params) {
    group('Using NRCELL API Simulate Client Topology GET request in CTS for the NRCELL and associated NRSECTORCARRIER', function () {
        group('Get NRCELL and associated NRSECTORCARRIERs', function () {
            let res;
            const request = http.get(NRCELL_URL + "/" + cellID + "?fs.nrSectorCarriers", addTagToHeaders(params, QUERY_TAG));
            res = check(request, {
                'Verify NRCELL API call and Status should be 200': (r) => r.status === 200
            });
            if (request.status != 200) console.log("NRCELL GET Request status is ", request.status);
            if (!res) errorCounter.add(1);
        })
    });
}
