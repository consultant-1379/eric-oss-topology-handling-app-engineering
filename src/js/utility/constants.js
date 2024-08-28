export const EIC_HOST = (__ENV.EIC_HOST_CM !== undefined && __ENV.EIC_HOST_CM !== "") ? `https://${__ENV.EIC_HOST_CM}` : `https://${__ENV.EIC_HOST_V}`;
export const GAS_HOST = (__ENV.GAS_HOST_CM !== undefined && __ENV.GAS_HOST_CM !== "") ? `https://${__ENV.GAS_HOST_CM}` : `https://${__ENV.GAS_HOST_V}`;
export const API_GW_URL = (__ENV.hostname_url_cm !== undefined && __ENV.hostname_url_cm !== "") ? `https://${__ENV.hostname_url_cm}` : `https://${__ENV.hostname_url_v}`;
export const SEF_ENABLED_TESTS = `${__ENV.SEF_ENABLED_TESTS}`.toLowerCase();
export const SEF_STATUS = (__ENV.SEF_STATUS_CM !== undefined && __ENV.SEF_STATUS_CM !== "") ? `${__ENV.SEF_STATUS_CM}`.toLowerCase() : `${__ENV.SEF_STATUS_V}`.toLowerCase();
export const HOST_URL = (SEF_ENABLED_TESTS == "true" && (SEF_STATUS == "true" || SEF_STATUS == "enabled")) ? EIC_HOST : API_GW_URL;
let IAM_HOST = (__ENV.IAM_HOST_CM !== undefined && __ENV.IAM_HOST_CM !== "") ? `https://${__ENV.IAM_HOST_CM}` : `https://${__ENV.IAM_HOST_V}`;
if (IAM_HOST === "undefined" || IAM_HOST.trim() === "" || IAM_HOST === "https://") {
  console.log("IAM_HOST not set, using EIC_HOST");
  let arr = API_GW_URL.split(".");
  arr.shift();
  IAM_HOST = "https://eic." + arr.join(".");
}
export { IAM_HOST };

// URLs
export const NRCELL_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/nrcell');
export const LTE_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/ltecell');
export const NRSECTORCARRIER_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/nrsectorcarrier');
export const GNBDU_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/gnbdu');
export const ENODEB_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/enodeb');
export const GNBCUUP_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/gnbcuup');
export const GNBCUCP_URL = HOST_URL.concat('/oss-core-ws/rest/ctw/gnbcucp');
export const Datasync_URL = HOST_URL.concat("/oss-core-ws/rest/osl-adv/datasync/process");

// Datasync
export const GNBDU = 'GNBDU'
export const ENODEB = 'ENODEB'
export const GNBCUCP = 'GNBCUCP'
export const GNBCUUP = 'GNBCUUP'

// Auth
export const METRICS_URL = GAS_HOST.concat('/metrics/viewer/api/v1/targets?state=active');
export const GAS_USER_NAME = 'gas-user';
export const GAS_USER_PASSWORD = 'Ericsson123!';
export const KEYCLOAK_TOKEN_LIFESPAN = 30 * 60;
export const IDM_URL = HOST_URL.concat("/idm/usermgmt/v1/users");
export const CLIENT_ID = 'th_k6_client';
export const CLIENT_ROLES = ["NetworkTopology_Application_Administrator", "OSSPortalAdmin"];

// Tags
export const READ_TAG = { type: 'READ' }
export const QUERY_TAG = { type: 'QUERY' }
export const CREATE_TAG = { type: 'CREATE' }
export const UPDATE_TAG = { type: 'UPDATE' }
export const DELETE_TAG = { type: 'DELETE' }
export const CREATE_DATASYNC_TAG = { type: 'CREATE - DATASYNC' }
export const DELETE_DATASYNC_TAG = { type: 'DELETE - DATASYNC' }
export const NON_LEGACY = { legacy: 'false' }
