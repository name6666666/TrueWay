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

let data: TrueWayData = {}

for (const info of mz.$dataMapInfos) {
    data[info.id] = {mapVars: {}}

    const map = mz.$dataMap[info.id]
    for (const event of map.events) {
        if (event === null) continue
        data[info.id][event.id] = {}
    }
}

TrueWay = {
    _data: data
}

export const defaultData: TrueWayData = data
