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

export function getEventIds(mapId?: number): number[] {
    if (mapId !== undefined && mz.$gameMap?.mapId() !== mapId) {
        return []
    }

    return mz.$dataMap?.events
        ?.map((event: any) => event?.id)
        .filter((id: number | undefined): id is number => id != null) ?? []
}

export const defaultData: TrueWayData = data
