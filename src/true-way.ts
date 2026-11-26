import mz from 'rmmz'


export class TrueWayError extends Error {
    constructor(message: string) {
        super(message)
        this.name = TrueWayError.name
    }
}

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
    Error: TrueWayError
}

export interface Param {
    map: string
    self: string
    onEnter: string
    initMap: string
    js: {
        label: string
        parentheses: '[]' | '{}' | '()'
    }
    mapTable: boolean
    eventTable: boolean
    global: string | null
}

const originalParam = mz.PluginManager.parameters('TrueWay')
originalParam.mapTable = originalParam.mapTable === 'true' ? true : false
originalParam.eventTable = originalParam.eventTable === 'true' ? true : false
originalParam.js = JSON.parse(originalParam.js as string)
// @ts-ignore
export const param: Param = originalParam

const identifierRegex = /^[\p{ID_Start}\p{ID_Continue}]*$/u
for (const ident of [
    param.map, param.self, param.onEnter, param.initMap, param.js.label
]) {
    const match = ident.match(identifierRegex)
    if (match === null) {
        throw new TrueWayError(`Invailid identifier ${JSON.stringify(ident)}`)
    }
}

if (param.global) {
    const match = param.global.match(identifierRegex)
    if (match === null) {
        throw new TrueWayError(`Invailid identifier ${JSON.stringify(param.global)}`)
    }
} else {
    param.global = null
}

if (!['[]', '()', '{}'].includes(param.js.parentheses)) {
    throw new TrueWayError(`Invailid parentheses ${param.js.parentheses}`)
}

export function genReg(label: string): RegExp {
    return new RegExp(String.raw`<${label}>(((?!(</${label}>))[\s\S])*?)</${label}>`, 'g')
}
