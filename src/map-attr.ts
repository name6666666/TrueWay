import mz from 'rmmz'
import {genReg, param, TrueWayError} from './true-way'
import escape from 'escape-string-regexp'
import { EventAttr, getEventByMapIdAndEventId } from './event-attr'
import './storage'
import { solveEventTable, solveMapTable } from './solve-table'


export interface MapAttr extends MapAttrBase {
    [attr: string]: any
}

class MapAttrBase {
    id: number
    entered: boolean = false
    constructor(id: number) {
        this.id = id
    }
    getEventById(eventId: number): EventAttr {
        return getEventByMapIdAndEventId(this.id, eventId)
    }
    getMapByName(name: string): MapAttr {
        if (inverseMapTable === null || mapTable === null) {
            throw new TrueWayError(
                `${this.getMapByName.name} unavailable. Particular configuration required`
            )
        }
        const path = [...inverseMapTable[this.id], name]
        let target = mapTable[path[0]]
        for (const i in path) {
            if (i === '0') continue
            const part = path[i]
            target = target.children[part]
        }
        if (!(this.id in TrueWay._data!)) throw new TrueWayError(`Unknown map name ${name}`)
        return TrueWay.getMapById!(target.id)
    }
    getEventByName(name: string): EventAttr {
        if (eventTable === null) {
            throw new TrueWayError(
                `${this.getEventByName.name} unavailable. Particular configuration required`
            )
        }
        const events = eventTable[this.id]
        const eventId = events[name]
        return getEventByMapIdAndEventId(this.id, eventId)
    }
    get parent(): MapAttr {
        const newId = mz.$dataMapInfos[this.id].parentId
        if (newId === 0) throw new TrueWayError(`Map ${this.id} has no parent`)
        return TrueWay.getMapById!(newId)
    }
}

declare module './true-way' {
    interface TrueWayType {
        getMapById: {(id: number): MapAttr}
        getMapByName: {(name: string): MapAttr}
        getMapCurrent: {(): MapAttr}
    }
}

export interface MapTable {
    [name: string]: {
        id: number
        children: MapTable
    }
}

export interface InverseMapTable {
    [id: number]: string[]
}

export interface EventTable {
    [mapId: number]: {
        [eventName: string]: number
    }
}

let mapTable: MapTable | null
let inverseMapTable: InverseMapTable | null
let eventTable: EventTable | null

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    let [a, b] = param.mapTable ? solveMapTable() : [null, null]
    mapTable = a
    inverseMapTable = b
    eventTable = param.eventTable ? solveEventTable() : null
    initAttr()
}

if (!param.initMap) throw new TrueWayError('Parameter error. Essential label required')
const initAttrPattern = genReg(param.initMap)
function initAttr() {
    const dataMapAll = TrueWay.$dataMapAll!
    for (const i in dataMapAll) {
        const map = TrueWay.getMapById!(Number(i))
        const matches = dataMapAll[i].note.matchAll(initAttrPattern)
        for (const match of matches) {
            const script = match[1]
            const func = new Function(param.map, script)
            func(map)
        }
    }
}

TrueWay.getMapById = function(id) {
    if (!(id in TrueWay._data!)) throw new TrueWayError(`Unknown map id ${id}`)
    return new Proxy(new MapAttrBase(id), {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![id].mapVars, p)
            if (ret === undefined) {
                if (p in target) {
                    return Reflect.get(target, p, receiver)
                }
                throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${id}`)
            }
            return ret
        },
        set: function(target, p, newValue) {
            if (newValue === undefined) {
                throw new TrueWayError(`Can not assign attribute ${String(p)} as undefined, when access map ${id}`)
            }
            return Reflect.set(TrueWay._data![id].mapVars, p, newValue)
        }
    })
}

TrueWay.getMapByName = function(name) {
    if (mapTable === null) throw new TrueWayError(`${TrueWay.getMapByName!.name} unavailable. Particular configuration required`)
    if (!(name in mapTable)) throw new TrueWayError(`Map ${name} is not a top map. Can not use ${TrueWay.getMapByName!.name}`)
    return TrueWay.getMapById!(mapTable[name].id)
}

TrueWay.getMapCurrent = function() {
    return TrueWay.getMapById!(mz.$gameMap.mapId())
}

const onEnterPattern = genReg(escape(param.onEnter))

const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)

    const map = TrueWay.getMapCurrent!()
    // @ts-ignore
    window[param.map] = map

    const matches = mz.$dataMap.note.matchAll(onEnterPattern)
    for (const match of matches) {
        const script = match[1]
        const func = new Function(script)
        func()
    }

    map.entered = true
}
