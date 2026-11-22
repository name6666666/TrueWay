import mz from 'rmmz'


export interface TrueWayData {
    [mapNumber: number]: MapData
}

export interface MapData {
    [eventNumber: number]: object
    mapVars: object
}

export interface TrueWay {
    _data: TrueWayData
}

declare global {
    let TrueWay: TrueWay
}

TrueWay = {
    _data: {}
}

let data: TrueWayData = {}

for (const info of mz.$dataMapInfos) {
    data[info.id] = {mapVars: {}}
}

export const defaultData: TrueWayData = data
