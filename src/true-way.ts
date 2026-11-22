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
