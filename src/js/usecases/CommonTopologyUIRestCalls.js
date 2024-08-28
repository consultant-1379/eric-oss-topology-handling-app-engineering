import * as http from "../modules/k6extra/http.js";
import { group } from "k6";
import check from "../modules/k6extra/check.js";
import { errorCounter } from "../main.js";
import { addTagToHeaders } from "../utility/auth.js"
import { READ_TAG, QUERY_TAG, HOST_URL } from "../utility/constants.js";

let id;
let modelEntity;
let shortBundleId;
let qualifiedObjectDefinitionId;

export default function (params) {
    group("Using GET requests from Common Topology UI", function () {
        group('UI calls Common Topology objectDescriptor via API Gateway', function () {
            let res;
            const objectDescriptorUrl = `${HOST_URL}/oss-core-ws/rest/oaf-adv/objectmetadata/objectDescriptor`;
            const request = http.get(objectDescriptorUrl, addTagToHeaders(params, READ_TAG));
            res = check(request, {
                "Verify Common Topology UI call and Status should be 200": (r) =>
                    r.status === 200,
            });
            if (request.status != 200) console.log("objectDescriptor GET Request status is ", request.status);
            //Use path syntax to find LTE Cell https://github.com/tidwall/gjson#path-syntax
            const lteCell = request.json('#(_id=="lteCell")');
            qualifiedObjectDefinitionId = lteCell.qualifiedObjectDefinitionId;
            shortBundleId = lteCell.shortBundleId;
            id = lteCell._id.toLowerCase();
            if (!res) errorCounter.add(1);
        });
        group('Common Topology UI searches for LTE entities with search criteria "LTE" via the API Gateway', function () {
            let res;
            const searchUrl = `${HOST_URL}/oss-core-ws/rest/${shortBundleId}/${id}?criteria=(name%20LIKE%20'%25LTE%25')`;
            const request = http.get(searchUrl, addTagToHeaders(params, QUERY_TAG));
            res = check(request, {
                "Verify Common Topology UI call and Status should be 200": (r) =>
                    r.status === 200,
            });
            if (request.status != 200) {
                console.log("Common Topology UI GET Request with search criteria status is ", request.status);
                console.log(searchUrl);
            }

            if (!res) errorCounter.add(1);
        });
        group("Common Topology UI gets the metadata associated with the LTE cells", function () {
            let res;
            const qualifiedObjectDefinitionIdUrl = `${HOST_URL}/oss-core-ws/rest/oaf-adv/objectmetadata/byObjectType?objectType=${qualifiedObjectDefinitionId}`;
            const request = http.get(qualifiedObjectDefinitionIdUrl, addTagToHeaders(params, QUERY_TAG));
            res = check(request, {
                "Verify CTS call and Status should be 200": (r) => r.status === 200,
            });
            const body = JSON.parse(request.body);
            modelEntity = request.json('associationBindingMetadataArray.0.qualifiedTargetObjectDefinitionId')
                .replace(":", "/")
                .toLocaleLowerCase();
            if (request.status != 200) {
                console.log("Common Topology UI GET Request by objectType status is ", request.status);
                console.log(qualifiedObjectDefinitionIdUrl);
            }
            if (!res) errorCounter.add(1);
        });
        group("Common Topology UI searches using modelEntity", function () {
            let res;
            const modelEntityUrl = `${HOST_URL}/oss-core-ws/rest/${modelEntity}`;
            const request = http.get(modelEntityUrl, addTagToHeaders(params, READ_TAG));
            res = check(request, {
                "Verify Common Topology UI call and Status should be 200": (r) =>
                    r.status === 200,
            });
            if (request.status != 200) {
                console.log("Common Topology UI GET Request using modelEntity status is ", request.status);
                console.log(modelEntityUrl);
            }
            if (!res) errorCounter.add(1);
        });
    });
}
