/*------------------------------------------------------------------------------
 *******************************************************************************
 * COPYRIGHT Ericsson 2023
 *
 * The copyright to the computer program(s) herein is the property of
 * Ericsson Inc. The programs may be used and/or copied only with written
 * permission from Ericsson Inc. or in accordance with the terms and
 * conditions stipulated in the agreement/contract under which the
 * program(s) have been supplied.
 *******************************************************************************
 *----------------------------------------------------------------------------*/
import * as http from "../modules/k6extra/http.js";
import { sleep } from 'k6';
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { HOST_URL } from "../utility/constants.js";

const Datasync_URL = HOST_URL.concat("/oss-core-ws/rest/osl-adv/datasync/process");

export function createCells(cellsNeeded, cellUrl, generateFunction, params) {
    let cellID = [];
    while (cellsNeeded > 0) {
        let reqestBody = [];
        let iterations = cellsNeeded % 100;
        let cellsCreated = 0;
        if (iterations == 0) iterations += 100;
        for (let i = 0; i < iterations; i++) {
            reqestBody.push(['POST', cellUrl, generateFunction(), params]);
        }
        sleep(5);
        const reqest = http.batch(reqestBody);
        for (let i = 0; i < reqest.length; i++) {
            if (reqest[i].status == 201) {
                cellID.push(JSON.parse(reqest[i].json('id')));
                cellsCreated++;
            }
        }
        cellsNeeded -= cellsCreated;
        sleep(5);
    }
    console.log("CELLS CREATED " + cellID);
    return cellID;
}

export function createDataSyncCells(cellsNeeded, cellURL, generateFunction, params) {
    let cellID = [];
    while (cellsNeeded > 0) {
        let reqestBody = [];
        let iterations = cellsNeeded % 100;
        let cellsCreated = 0;
        if (iterations == 0) iterations += 100;
        for (let i = 0; i < iterations; i++) {
            reqestBody.push(['POST', cellURL, generateFunction(), params]);
        }
        sleep(5);
        const reqest = http.batch(reqestBody);
        for (let i = 0; i < reqest.length; i++) {
            if (reqest[i].status == 200) {
                cellID.push(reqest[i].json('reconciliationItems.0.dtoObject.id'));
                cellsCreated++;
            }
            else {
                console.log("BATCH STATUS AT INDEX " + i + " :" + reqest[i].status);
            }
        }
        cellsNeeded -= cellsCreated;
        sleep(5);
    }
    console.log(cellsNeeded + " CELLS CREATED ");
    return cellID;
}

const randomID1 = randomString(32);
const randomDNPrefix1 = randomString(6) + "/" + randomString(6) + "/" + randomString(6);

export function setupNRCellAssociatedWithGNBDU(params) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbdu",
                    "$action": "reconcile",
                    "$refId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                    "externalId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                    "status": "operating",
                    "name": randomDNPrefix1 + "/me04/gnbdu04"
                },
                {
                    "$type": "ctw/nrCell",
                    "$action": "reconcile",
                    "$refId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "externalId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "$gnbdu": [
                        randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04"
                    ],
                    "status": "operating",
                    "name": randomDNPrefix1 + "/me04/gnbdu04/NR-Cell-07"
                }
            ]
        }
    });
    let request;
    request = http.post(Datasync_URL, data, params);
    if (request.status != 200) console.log('Request Status: ' + request.status);
    let cellID = [];
    cellID.push(request.json('reconciliationItems.0.dtoObject.id'));
    return cellID;
}

export function deleteNRCellAssociatedWithGNBDU(params) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbdu",
                    "$action": "delete",
                    "$refId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                    "externalId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04",
                    "status": "operating",
                    "name": randomDNPrefix1 + "/me04/gnbdu04"
                },
                {
                    "$type": "ctw/nrCell",
                    "$action": "delete",
                    "$refId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "externalId": randomID1 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "status": "operating",
                    "name": randomDNPrefix1 + "/me04/gnbdu04/NR-Cell-07"
                }
            ]
        }
    });
    http.post(Datasync_URL, data, params);
}

const randomID2 = randomString(32);
const randomDNPrefix2 = randomString(6) + "/" + randomString(6) + "/" + randomString(6);

export function setupNrSectorCarrierAssociatedWithNRCell(params) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/nrCell",
                    "$action": "reconcile",
                    "$refId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "externalId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "status": "operating",
                    "name": randomDNPrefix2 + "/me04/gnbdu04/NR-Cell-07"
                },
                {
                    "$type": "ctw/nrSectorCarrier",
                    "$action": "reconcile",
                    "$refId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRSectorCarrier=NR-SectorCarrier-07",
                    "externalId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRSectorCarrier=NR-SectorCarrier-07",
                    "txDirection": "DL and UL",
                    "$nrCell": [
                        randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07"
                    ],
                    "status": "operating",
                    "name": randomDNPrefix2 + "/me04/gnbdu04/NR-SectorCarrier-07"
                }
            ]
        }
    });
    let request;
    request = http.post(Datasync_URL, data, params);
    if (request.status != 200) console.log('Request Status: ' + request.status);
    let cellID = [];
    cellID.push(request.json('reconciliationItems.0.dtoObject.id'));
    return cellID;
}

export function deleteNrSectorCarrierAssociatedWithNRCell(params) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/nrCell",
                    "$action": "delete",
                    "$refId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "externalId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRCellDU=NR-Cell-07",
                    "status": "operating",
                    "name": randomDNPrefix2 + "/me04/gnbdu04/NR-Cell-07"
                },
                {
                    "$type": "ctw/nrSectorCarrier",
                    "$action": "delete",
                    "$refId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRSectorCarrier=NR-SectorCarrier-07",
                    "externalId": randomID2 + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu04/ericsson-enm-GNBDU:NRSectorCarrier=NR-SectorCarrier-07",
                    "txDirection": "DL and UL",
                    "status": "operating",
                    "name": randomDNPrefix2 + "/me04/gnbdu04/NR-SectorCarrier-07"
                }
            ]
        }
    });
    http.post(Datasync_URL, data, params);
}

export function setupCells(numberOfTests, urlForGet, createCellsFunction, urlForCreate, generateFunction, params) {
    let request;
    request = http.get(urlForGet + "?.sort=objectInstId", params);
    if (request.status != 201) console.log('Request Status: ' + request.status);
    const body = JSON.parse(request.body);
    let avaliableCells = body.flatMap(a => a.id);
    if (avaliableCells.length != 0) {
        let x = avaliableCells[avaliableCells.length - 1] + 1;
        while (avaliableCells.length < numberOfTests) {
            const getRequest = http.get(urlForGet + "?.sort=objectInstId&objectInstId.gt=" + x + "L", params);
            const body = JSON.parse(getRequest.body);
            if (body.length == 0) break;
            let moreCells = body.flatMap(a => a.id);
            avaliableCells = avaliableCells.concat(moreCells);
            x = avaliableCells[avaliableCells.length - 1] + 1;
        }
    }
    if (avaliableCells.length < numberOfTests) {
        let cellsNeeded = (numberOfTests - avaliableCells.length);
        avaliableCells = avaliableCells.concat(createCellsFunction(cellsNeeded, urlForCreate, generateFunction, params));
    }
    return avaliableCells;
}

export function teardownCells(numberOfCellsToBeDeleted, cellURL, params) {
    let response;
    response = http.get(cellURL + "?.sort=objectInstId", params)

    const body = JSON.parse(response.body);
    let avaliableCells = body.flatMap(a => a.id);
    if (avaliableCells.length != 0) {
        let x = avaliableCells[avaliableCells.length - 1] + 1;
        while (avaliableCells.length < numberOfCellsToBeDeleted) {
            const getRequest = http.get(cellURL + "?.sort=objectInstId&objectInstId.gt=" + x + "L", params);
            const body = JSON.parse(getRequest.body);
            if (body.length == 0) break;
            let moreCells = body.flatMap(a => a.id);
            avaliableCells = avaliableCells.concat(moreCells);
            x = avaliableCells[avaliableCells.length - 1] + 1;
        }
    }
    let offset = 0;
    while (numberOfCellsToBeDeleted > 0) {
        let reqestBody = [];
        let iterations = numberOfCellsToBeDeleted % 500;
        if (iterations == 0) iterations += 500;
        for (let i = 0; i < iterations; i++) {
            reqestBody.push(['DELETE', cellURL + "/" + avaliableCells[i + offset], null, params]);
        }
        http.batch(reqestBody);
        numberOfCellsToBeDeleted -= iterations;
        offset += iterations;
    }
}
