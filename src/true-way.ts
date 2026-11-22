import mz from 'rmmz'


export class TrueWayError extends Error {}

export interface TrueWayData {
    [mapNumber: number]: MapData
}

export interface MapData {
    [eventNumber: number]: object
    mapVars: object
}

export interface TrueWayType {
    _data: TrueWayData
    Error: typeof TrueWayError
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

export var TrueWay: Partial<TrueWayType> = {
    _data: data,
    Error: TrueWayError
}

export const defaultData: TrueWayData = data
