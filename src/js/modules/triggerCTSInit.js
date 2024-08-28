
// Containts function to trigger CTS' lazy initalization.
// This can prevent 504 errors due to initialization taking too long.


import * as http from "../modules/k6extra/http.js";

import { HOST_URL } from '../utility/constants.js'

function initWithModel(objectType, params) {
    console.info("Initializing " + objectType + "...");
    let reqURL = HOST_URL + "/oss-core-ws/rest/ctw/" + objectType + "?.sort=objectInstId";
    let resp =  http.get(reqURL, params);
    if (resp.status == 504) {
        console.log("504 happened during CTS initialization. This is expected behaviour. Testing can continue...");
    } else {
        console.info("Initialization for " + objectType + " took " + resp.timings.duration + "ms");
    }
    return resp;
}

export default function(params){
    initWithModel("nrcell", params);
    initWithModel("enodeb", params);
    initWithModel("gnbcucp", params);
    initWithModel("gnbcuup", params);
    initWithModel("gnbdu", params);
    initWithModel("ltecell", params);
    initWithModel("nrcell", params);
    initWithModel("nrsectorcarrier", params);
}
