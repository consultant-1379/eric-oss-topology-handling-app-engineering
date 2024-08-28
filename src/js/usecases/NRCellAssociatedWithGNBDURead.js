import * as http from "../modules/k6extra/http.js";
import { group } from 'k6';
import check from "../modules/k6extra/check.js";
import { errorCounter } from '../main.js';
import { addTagToHeaders } from "../utility/auth.js"
import { QUERY_TAG, GNBDU_URL } from "../utility/constants.js";

export default function (cellID, params) {
    group('Using GNBDU API Simulate Client Topology GET request in CTS for the GNBDU and associated NRCells', function () {
        group('Get GNBDU and associated NRCELLs', function () {
            let res;
            const request = http.get(GNBDU_URL + "/" + cellID + "?fs.nrCells", addTagToHeaders(params, QUERY_TAG));
            res = check(request, {
                'Verify GNBDU API call and Status should be 200': (r) => r.status === 200
            });
            if (request.status != 200) console.log("GNBDU GET Request status is ", request.status);
            if (!res) errorCounter.add(1);
        })
    });
}
