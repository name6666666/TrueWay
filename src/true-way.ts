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

declare global {
    let TrueWay: Partial<TrueWayType>
}

// @ts-ignore
window.TrueWay = {
    _data: {},
    Error: TrueWayError
}

export const param = mz.PluginManager.parameters('TrueWay')
