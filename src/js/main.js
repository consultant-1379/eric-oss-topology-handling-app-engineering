/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2024
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
// K6/JS stuff
import { CookieJar } from "k6/http";
import { check, group } from "k6";
import { Counter } from "k6/metrics";
import { htmlReport } from "https://arm1s11-eiffel004.eiffel.gic.ericsson.se:8443/nexus/content/sites/oss-sites/common/k6/eric-k6-static-report-plugin/latest/bundle/eric-k6-static-report-plugin.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import exec from "k6/execution";

// Legacy cases
import Legacy_Usecase1_NGCoreNetFunction from "./usecases/legacy/ngcorenetfunction.js";
import Legacy_Usecase2_NRF from "./usecases/legacy/nrf.js";
import Legacy_Usecase3_SMF from "./usecases/legacy/smf.js";
import Legacy_Usecase4_FiveQISetService from "./usecases/legacy/FiveQISetService.js";
import Legacy_Usecase5_FiveQIFlowService from "./usecases/legacy/FiveQIFlowService.js";

// Imports for Usecases
import * as nrCellOps from "./usecases/NRCellOperations.js";
import * as lteCellOps from "./usecases/LTECellOperations.js";
import * as nrSectorCarrierOps from "./usecases/NRSectorCarrierOperations.js";
import * as datasyncOps from "./usecases/DatasyncOperations.js";
import Usecase_NRCellAssociatedWithGNBDURead from "./usecases/NRCellAssociatedWithGNBDURead.js";
import Usecase_NRSectorCarrierAssociatedWithNRCellRead from "./usecases/NRSectorCarrierAssociatedWithNRCellRead.js";
import Usecase_CTSUI from "./usecases/CommonTopologyUIRestCalls.js";
import Usecase_APIGW_sanityCheckingAPIGW from "./usecases/sanityCheckingAPIGW.js";
import Usecase_CheckScrapePoolsStatus from "./usecases/CheckScrapePoolsStatus.js";

// PE only cases
import DatasyncMeasurementENodeB from "./usecases/PE/PEDatasyncMeasurementENodeB.js";
import DatasyncMeasurementGNBCUCP from "./usecases/PE/PEDatasyncMeasurementGNBCUCP.js";
import DatasyncMeasurementGNBCUUP from "./usecases/PE/PEDatasyncMeasurementGNBCUUP.js";
import DatasyncMeasurementGNBDU from "./usecases/PE/PEDatasyncMeasurementGNBDU.js";

// Generic imports
import { createCells, createDataSyncCells, setupCells, setupNRCellAssociatedWithGNBDU, setupNrSectorCarrierAssociatedWithNRCell, deleteNRCellAssociatedWithGNBDU, deleteNrSectorCarrierAssociatedWithNRCell, teardownCells } from "./usecases/setup.js";
import { generateNRCellPayload, generateLTECellPayload, generateNRSectorCarrierPayload, generateGNBDUPayload, generateENODEBPayload, generateGNBCUUPPayload, generateGNBCUCPPayload } from './PayloadGenerators.js';
import triggerCTSInit from "./modules/triggerCTSInit.js";
import { ENODEB, GNBDU, GNBCUCP, GNBCUUP, IAM_HOST, EIC_HOST, GAS_HOST, API_GW_URL, SEF_STATUS, SEF_ENABLED_TESTS, CLIENT_ROLES, NRCELL_URL, LTE_URL, NRSECTORCARRIER_URL, GNBDU_URL, ENODEB_URL, GNBCUUP_URL, GNBCUCP_URL, Datasync_URL, HOST_URL, NON_LEGACY } from "./utility/constants.js";
import * as auth from "./utility/auth.js";
import * as http from "./modules/k6extra/http.js";

export const errorCounter = new Counter("Errors");

let params;
let optionsPath = `${__ENV.OPTIONS_FILE}`
let renewedBearer;
export const optionsFile = JSON.parse(open(optionsPath));

export const logger = (statement, response) => {
  console.log(statement);
  if (response) {
    console.log('Response status: ' + response.status);
    console.log('Response body: ' + response.body);
    console.log('Whole response: ' + JSON.stringify(response));
  }
}

// Legacy case -- not used?
export function LegacyTests(data) {
  Legacy_Usecase1_NGCoreNetFunction(data.params);
  Legacy_Usecase2_NRF(data.params);
  Legacy_Usecase3_SMF(data.params);
  Legacy_Usecase4_FiveQISetService(data.params);
  Legacy_Usecase5_FiveQIFlowService(data.params);
}

// NRCell TCs
export function NRCellLoad(data) {
  group('Using NRCELL API to Load Test Client Topology in CTS for NRCELL operations', function () {
    let cellID = nrCellOps.CreateNRCell(data.params)
    nrCellOps.ReadNRCell(cellID, data.params)
    nrCellOps.UpdateNRCell(cellID, data.params)
    nrCellOps.DeleteNRCell(cellID, data.params)
  })
}

export function NRCellReadOperation(data) {
  nrCellOps.ReadNRCell(data.setupFunctions[0][0], data.params)
}

export function NRCellCreateOperation(data) {
  nrCellOps.CreateNRCell(data.params)
}

export function NRCellUpdateOperation(data) {
  nrCellOps.UpdateNRCell(data.setupFunctions[0][0], data.params)
}

export function NRCellDeleteOperation(data) {
  nrCellOps.DeleteNRCell(data.setupFunctions[0][0], data.params)
}

// LTE Cell cases
export function LTECellLoad(data) {
  group('Using LTECELL API to Load Test Client Topology in CTS for LTECELL operations', function () {
    let cellID = lteCellOps.CreateLTECell(data.params)
    lteCellOps.ReadLTECell(cellID, data.params)
    lteCellOps.UpdateLTECell(cellID, data.params)
    lteCellOps.DeleteLTECell(cellID, data.params)
  })
}

export function LTECellReadOperation(data) {
  lteCellOps.ReadLTECell(data.setupFunctions[1][0], data.params)
}

export function LTECellCreateOperation(data) {
  lteCellOps.CreateLTECell(data.params)
}

export function LTECellUpdateOperation(data) {
  lteCellOps.UpdateLTECell(data.setupFunctions[1][0], data.params)
}

export function LTECellDeleteOperation(data) {
  lteCellOps.DeleteLTECell(data.setupFunctions[1][0], data.params)
}

// NR Sector Carrier cases
export function NRSectorCarrierLoad(data) {
  group('Using NRSECTORCARRIER API to Load Test Client Topology in CTS for NRSECTORCARRIER operations', function () {
    let cellID = nrSectorCarrierOps.CreateNRSectorCarrier(data.params)
    nrSectorCarrierOps.ReadNRSectorCarrier(cellID, data.params)
    nrSectorCarrierOps.UpdateNRSectorCarrier(cellID, data.params)
    nrSectorCarrierOps.DeleteNRSectorCarrier(cellID, data.params)
  })
}

export function NRSectorCarrierReadOperation(data) {
  nrSectorCarrierOps.ReadNRSectorCarrier(data.setupFunctions[2][0], data.params)
}

export function NRSectorCarrierCreateOperation(data) {
  nrSectorCarrierOps.CreateNRSectorCarrier(data.params)
}

export function NRSectorCarrierUpdateOperation(data) {
  nrSectorCarrierOps.UpdateNRSectorCarrier(data.setupFunctions[2][0], data.params)
}

export function NRSectorCarrierDeleteOperation(data) {
  nrSectorCarrierOps.DeleteNRSectorCarrier(data.setupFunctions[2][0], data.params)
}

// ENodeB tests
export function testENodeB(data) {
  const randomID = randomString(32)
  const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6)
  datasyncOps.Create(data.params, ENODEB, randomID, randomDNPrefix)
  datasyncOps.Delete(data.params, ENODEB, randomID, randomDNPrefix)
}

// GNBDU tests
export function testGNBDU(data) {
  const randomID = randomString(32)
  const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6)
  datasyncOps.Create(data.params, GNBDU, randomID, randomDNPrefix)
  datasyncOps.Delete(data.params, GNBDU, randomID, randomDNPrefix)
}

// GNBCUUP tests
export function testGNBCUUP(data) {
  const randomID = randomString(32)
  const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6)
  datasyncOps.Create(data.params, GNBCUUP, randomID, randomDNPrefix)
  datasyncOps.Delete(data.params, GNBCUUP, randomID, randomDNPrefix)
}

// GNBCUCP tests
export function testGNBCUCP(data) {
  const randomID = randomString(32)
  const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6)
  datasyncOps.Create(data.params, GNBCUCP, randomID, randomDNPrefix)
  datasyncOps.Delete(data.params, GNBCUCP, randomID, randomDNPrefix)
}

// Query tests
export function NRCellAssociatedWithGNBDUReadOperation(data) {
  Usecase_NRCellAssociatedWithGNBDURead(data.setupFunctions[3][0], data.params);
}

export function NRSectorCarrierAssociatedWithNRCellReadOperation(data) {
  Usecase_NRSectorCarrierAssociatedWithNRCellRead(data.setupFunctions[4][0], data.params);
}

// UI tests
export function CTSUIRestCalls(data) {
  Usecase_CTSUI(data.params);
}

// PE cases
export function NRCellReadOperationPE(data) {
  nrCellOps.ReadNRCell(data.setupFunctions[0][0], data.params);
}

export function LTECellReadOperationPE(data) {
  lteCellOps.ReadLTECell(data.setupFunctions[1][0], data.params);
}

export function NRSectorCarrierReadOperationPE(data) {
  nrSectorCarrierOps.ReadNRSectorCarrier(data.setupFunctions[2][0], data.params);
}

export function NRCellAssociatedWithGNBDUReadOperationPE(data) {
  Usecase_NRCellAssociatedWithGNBDURead(data.setupFunctions[3][0], data.params);
}

export function NRSectorCarrierAssociatedWithNRCellReadOperationPE(data) {
  Usecase_NRSectorCarrierAssociatedWithNRCellRead(data.setupFunctions[4][0], data.params);
}

export function PEDatasyncMeasurementENodeB(data) {
  DatasyncMeasurementENodeB(data.params);
}

export function PEDatasyncMeasurementGNBCUCP(data) {
  DatasyncMeasurementGNBCUCP(data.params);
}

export function PEDatasyncMeasurementGNBCUUP(data) {
  DatasyncMeasurementGNBCUUP(data.params);
}

export function PEDatasyncMeasurementGNBDU(data) {
  DatasyncMeasurementGNBDU(data.params);
}

export function sanityCheckingAPIGW(data) {
  Usecase_APIGW_sanityCheckingAPIGW(data.params);
}

export function testScrapePools(data) {
  Usecase_CheckScrapePoolsStatus(data.params);
}

export function setup() {
  console.log('SEF_STATUS: ' + SEF_STATUS);
  console.log('SEF_ENABLED_TESTS: ' + SEF_ENABLED_TESTS);
  console.log('SEF_STATUS and SEF_ENABLED_TESTS --> SEF is: ' + (SEF_ENABLED_TESTS == "true" && (SEF_STATUS == "true" || SEF_STATUS == "enabled")));
  console.log('HOST_URL: ' + HOST_URL);
  console.log('EIC_HOST: ' + EIC_HOST);
  console.log('IAM_HOST: ' + IAM_HOST);
  console.log('GAS_HOST: ' + GAS_HOST);
  console.log('API_GW_URL: ' + API_GW_URL);

  const returned_stuff = authorizeCCF();
  const bearer_token = returned_stuff.accessToken
  params = {
    headers: {
      Authorization: 'Bearer ' + bearer_token,
      'content-type': 'application/json',
      timeout: '120s',
    }
  };

  console.log('Bearer token: ' + bearer_token)

  triggerCTSInit(params);

  return {
    accessToken: returned_stuff.accessToken,
    clientId: returned_stuff.clientId,
    clientSecret: returned_stuff.clientSecret,
    params: params,
    setupFunctions: [
      createCells(1, NRCELL_URL, generateNRCellPayload, params),
      createCells(1, LTE_URL, generateLTECellPayload, params),
      createCells(1, NRSECTORCARRIER_URL, generateNRSectorCarrierPayload, params),
      setupNRCellAssociatedWithGNBDU(params),
      setupNrSectorCarrierAssociatedWithNRCell(params)
    ]
  }
}

export function teardown(data) {
  renewedBearer = auth.getNewAccessTokenInScenario(data.clientSecret)
  data.params.headers.Authorization = "Bearer " + renewedBearer
  let emptyJar = CookieJar();
  let params = data.params
  params.jar = emptyJar
  if (optionsFile.scenarios.nrcell_get_operationPE) {
    console.log("Starting PE exec teardown");
    nrCellOps.DeleteNRCell(data.setupFunctions[0][0], params);
    params.jar = emptyJar
    lteCellOps.DeleteLTECell(data.setupFunctions[1][0], params);
    params.jar = emptyJar
    nrSectorCarrierOps.DeleteNRSectorCarrier(data.setupFunctions[2][0], params);
    params.jar = emptyJar
    deleteNRCellAssociatedWithGNBDU(data.setupFunctions, params);
    params.jar = emptyJar
    deleteNrSectorCarrierAssociatedWithNRCell(data.setup_data.params);
  }
  else {
    console.log("Starting APP ENG exec teardown");
    deleteNRCellAssociatedWithGNBDU(data.setupFunctions, params);
    params.jar = emptyJar
    deleteNrSectorCarrierAssociatedWithNRCell(data.setup_data.params);
  }
  //get new bearer
  console.log('Deleting K6 client in Keycloak ...');
  let { clientId } = data;
  let keycloakToken = auth.getKeycloakToken().json()['access_token'];
  const url = `${IAM_HOST}/auth/admin/realms/master/clients/${clientId}`;
  const headers = {
    Authorization: 'Bearer ' + keycloakToken,
    'Content-Type': 'application/json',
    Accept: '*/*',
    Cookie: {},
  };
  //delete the created client with the new bearer
  let res = http.del(url, null, { headers });
  check(res, {
    'k6test client deleted successfully': res.status == 204,
  });
  if (!res) {
    console.log('Delete client status: ' + res.status);
    console.log('Delete client body: ' + res.body);
    console.log('keycloakToken: ' + keycloakToken);
    console.log('clientid: ' + clientId);
  }
}

export function handleSummary(data) {
  let reports = {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
    "/reports/summary.json": JSON.stringify(data)
  }

  try {
    let generated_htmlReport = htmlReport(data)
    reports["/reports/TopologyHandling_HtmlReport.html"] = generated_htmlReport
  } catch (ex) {
    console.log("Could not generate HTML report: " + ex)
  }

  return reports
}

export function authorizeCCF() {
  const keycloakTokenResponse = auth.getKeycloakToken();
  check(keycloakTokenResponse, {
    "Get keycloak token status should be 200": () => keycloakTokenResponse.status === 200
  });

  const keycloakToken = JSON.parse(keycloakTokenResponse.body).access_token;
  const setTokenDurationResponse = auth.setKeycloakTokenDuration(keycloakToken);
  check(setTokenDurationResponse, {
    "Set token duration on Keycloak status should be 204": () => setTokenDurationResponse.status === 204
  });

  let getClientIdListResponse = auth.getClientIdList(keycloakToken);
  if (getClientIdListResponse.status === 200) {
    let clientIdList = JSON.parse(getClientIdListResponse.body)
    if (clientIdList.length > 0) {
      console.log("Client already exists");
      const clientId = clientIdList[0].id;
      const url = `${IAM_HOST}/auth/admin/realms/master/clients/${clientId}`;
      const headers = {
        Authorization: 'Bearer ' + keycloakToken,
        'Content-Type': 'application/json',
        Accept: '*/*',
        Cookie: {},
      };
      //delete the created client with the new bearer
      let res = http.del(url, null, { headers });
      check(res, {
        'k6test client deleted successfully': res.status == 204,
      });
    }
  }

  const createRappClientResponse = auth.createRappClient(keycloakToken);
  check(createRappClientResponse, {
    "Create rApp client name on Keycloak status should be 201": () => createRappClientResponse.status === 201
  });

  getClientIdListResponse = auth.getClientIdList(keycloakToken);
  check(getClientIdListResponse, {
    "Get ClientID list status should be 200": () => getClientIdListResponse.status === 200
  });

  const clientId = JSON.parse(getClientIdListResponse.body)[0].id;
  const getServiceRolesIdResponse = auth.getServiceRolesId(keycloakToken, clientId);
  check(getServiceRolesIdResponse, {
    "Get Service Role id status should be 200": () => getServiceRolesIdResponse.status === 200
  });

  const serviceRolesId = JSON.parse(getServiceRolesIdResponse.body).id;
  const getServiceRolesIdListResponse = auth.getServiceRolesIdList(keycloakToken, serviceRolesId);
  check(getServiceRolesIdListResponse, {
    "Get Service roles list status should be 200": () => getServiceRolesIdListResponse.status === 200
  });

  const getServiceRolesIdListResponseBody = JSON.parse(getServiceRolesIdListResponse.body);
  const rolesWithIds = CLIENT_ROLES.map(role => {
    const id = getServiceRolesIdListResponseBody.find(roleId => roleId.name === role).id;
    const name = role;
    return {
      id,
      name
    }
  });
  rolesWithIds.forEach(roleWithId => {
    const response = auth.setServiceRoles(keycloakToken, serviceRolesId, [roleWithId]);
    const result = check(response, {
      [`Set role ${roleWithId.name} on Keycloak status should be 204`]: () => response.status === 204
    });
    if (!result) logger(`Set role ${roleWithId.name} on Keycloak FAILED`, response)
  });
  const regenerateClientSecretResponse = auth.regenerateClientSecret(clientId, keycloakToken);
  const regenerateClientSecretResult = check(regenerateClientSecretResponse, {
    "Change Client secret status should be 200": () => regenerateClientSecretResponse.status === 200
  });
  if (!regenerateClientSecretResult) logger('Change Client secret FAILED', regenerateClientSecretResponse);
  const clientSecret = JSON.parse(regenerateClientSecretResponse.body).value;
  const getKeyCloakTokenSecretResponse = auth.getKeycloakTokenSecret(clientSecret);
  check(getKeyCloakTokenSecretResponse, {
    "Get keycloak token secret status should be 200": () => getKeyCloakTokenSecretResponse.status === 200
  });
  const accessToken = JSON.parse(getKeyCloakTokenSecretResponse.body).access_token;
  const refreshToken = JSON.parse(getKeyCloakTokenSecretResponse.body).refresh_token;
  console.log('SEF Access Token:', accessToken);
  return {
    accessToken,
    clientId,
    clientSecret,
    refreshToken
  }
}
