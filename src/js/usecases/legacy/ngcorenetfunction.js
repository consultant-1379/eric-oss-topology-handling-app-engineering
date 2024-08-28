import * as http from "../../modules/k6extra/http.js";
import { group, sleep } from 'k6';
import check from "../../modules/k6extra/check.js";
import { errorCounter } from '../../main.js';
import { HOST_URL } from "../../utility/constants.js";

export default function (params) {
    group('Verify NGcorenetfunction API call Status', function () {
        const requests = http.request('GET', HOST_URL + '/oss-core-ws/rest/ctw/ngcorenetfunction', "", params);
        sleep(1);
        const res = check(requests, {
            'Verify NGcorenetfunction API call and Status should be 200': (r) => r.status === 200
        })
        if (!res) {
            errorCounter.add(1);
        }
        if (requests.status != 200) console.log("NGcorenetfunction Request status is ", requests.status);
    });
}
