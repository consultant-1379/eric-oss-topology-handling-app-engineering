import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export function generateNRCellPayload() {
    const randomID = randomString(32);
    const data = JSON.stringify({
        "type": "ctw/nrcell",
        "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=NR04gNodeBRadio00001/ericsson-enm-GNBDU:GNBDUFunction=1/ericsson-enm-GNBDU:NRCellDU=NR04gNodeBRadio00001-3",
        "name": randomID + "/Ireland/NR04gNodeBRadio00001/NR04gNodeBRadio00001/1/NR04gNodeBRadio00001-3",
        "status": "operating",
        "administrativeState": "LOCKED",
        "localCellIdNci": 63,
        "physicalCellIdentity": 435,
        "trackingAreaCode": 999
    });
    return data;
}

export function generateLTECellPayload(){
    const randomID = randomString(32);
    const data = JSON.stringify({
        "type": "ctw/ltecell",
        "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=LTE18dg2ERBS00071/ericsson-enm-Lrat:ENodeBFunction=1/ericsson-enm-Lrat:EUtranCellFDD=LTE18dg2ERBS00071-1",
        "name": randomID + "/Ireland/NETSimW/LTE18dg2ERBS00071/1/LTE18dg2ERBS00071-1",
        "status": "operating",
        "_type": "FDD",
        "cellLocalId": 1,
        "FDDearfcnDl": 4,
        "FDDearfcnUl": 18004
    });
    return data;
}

export function generateNRSectorCarrierPayload(){
    const randomID = randomString(32);
    const data = JSON.stringify({
        "type": "ctw/nrsectorcarrier",
        "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=NR01gNodeBRadio00012/ericsson-enm-GNBDU:GNBDUFunction=1/ericsson-enm-GNBDU:NRSectorCarrier=1",
        "name": randomID + "/Ireland/NR01gNodeBRadio00012/NR01gNodeBRadio00012/1/1",
        "status": "operating",
        "txDirection": "DL and UL",
        "configuredMaxTxPower": 20000,
        "arfcnDL": 0,
        "arfcnUL": 0,
        "bSChannelBwDL": 0,
        "bSChannelBwUL": 0
    });
    return data;
}

export function generateGNBDUPayload(){
    const randomID = randomString(32);
    const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbdu",
                    "$action": "reconcile",
                    "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                    "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                    "status": "operating",
                    "name": randomDNPrefix + "/me04/gnbdu03"
                }
            ]
        }
    });
    return data;
}

export function generateENODEBPayload(){
    const randomID = randomString(32);
    const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/eNodeB",
                    "$action": "reconcile",
                    "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                    "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                    "status": "operating",
                    "name": randomDNPrefix + "/managedelement01/enodeb01"
                }
            ]
        }
    });
    return data;
}

export function generateGNBCUUPPayload(){
    const randomID = randomString(32);
    const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbcuup",
                    "$action": "reconcile",
                    "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                    "externalId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                    "status": "operating",
                    "name": randomDNPrefix + "/me04/gnbcuup02"
                }
            ]
        }
    });
    return data;
}

export function generateGNBCUCPPayload(){
    const randomID = randomString(32);
    const randomDNPrefix = randomString(6) + "/" + randomString(6) + "/" + randomString(6);
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbcucp",
                    "$action": "reconcile",
                    "$refId": randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUCP:GNBCUCPFunction=gnbcucp03",
                    "externalId":  randomID + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUCP:GNBCUCPFunction=gnbcucp03",
                    "status": "operating",
                    "name": randomDNPrefix + "/me04/gnbcucp03"
                }
            ]
        }
    });
    return data;
}

export function GNBDUPayload(action, id, dn) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbdu",
                    "$action": action,
                    "$refId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                    "externalId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBDU:GNBDUFunction=gnbdu03",
                    "status": "operating",
                    "name": dn + "/me04/gnbdu03"
                }
            ]
        }
    });
    return data;
}

export function ENODEBPayload(action, id, dn) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/eNodeB",
                    "$action": action,
                    "$refId": id + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                    "externalId": id + "/ericsson-enm-ComTop:ManagedElement=managedelement01/ericsson-enm-Lrat:ENodeBFunction=enodeb01",
                    "status": "operating",
                    "name": dn + "/managedelement01/enodeb01"
                }
            ]
        }
    });
    return data;
}

export function GNBCUUPPayload(action, id, dn) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbcuup",
                    "$action": action,
                    "$refId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                    "externalId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUUP:GNBCUUPFunction=gnbcuup02",
                    "status": "operating",
                    "name": dn + "/me04/gnbcuup02"
                }
            ]
        }
    });
    return data;
}

export function GNBCUCPPayload(action, id, dn) {
    const data = JSON.stringify({
        "type": "osl-adv\/datasyncservice\/process",
        "jsonHolder": {
            "type": "gs\/jsonHolder",
            "json": [
                {
                    "$type": "ctw/gnbcucp",
                    "$action": action,
                    "$refId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUCP:GNBCUCPFunction=gnbcucp03",
                    "externalId": id + "/ericsson-enm-ComTop:ManagedElement=me04/ericsson-enm-GNBCUCP:GNBCUCPFunction=gnbcucp03",
                    "status": "operating",
                    "name": dn + "/me04/gnbcucp03"
                }
            ]
        }
    });
    return data;
}
