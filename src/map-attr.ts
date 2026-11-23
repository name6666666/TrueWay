import mz from 'rmmz'
import {genReg, param, TrueWayError} from './true-way'
import escape from 'escape-string-regexp'
import { EventAttr, getEventByMapIdAndEventId } from './event-attr'
import './storage'


export interface MapAttr {
    [attr: string]: any
    id: number
    parent: MapAttr
    entered: boolean
    getEventById: {(id: number): EventAttr}
}

declare module './true-way' {
    interface TrueWayType {
        getMapById: {(id: number): MapAttr}
        getMapByName: {(name: string): MapAttr}
        getMapCurrent: {(): MapAttr}
    }
}

function parent(id: number): MapAttr {
    const newId = mz.$dataMapInfos[id].parentId
    if (newId === 0) throw new TrueWayError(`Map ${id} has no parent`)
    return TrueWay.getMapById!(newId)
}

// @ts-ignore
TrueWay.getMapById = function(id) {
    if (!(id in TrueWay._data!)) throw new TrueWayError(`Unknown map id ${id}`)
    return new Proxy({}, {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![id].mapVars, p)
            if (ret === undefined) {
                switch (p) {
                    case 'id': return id
                    case 'parent': return parent(id)
                    case 'entered': return false
                    case 'getEventById': return function(eventId: number): EventAttr {
                        return getEventByMapIdAndEventId(id, eventId)
                    }
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

function solveMapTable(): MapTable {
    interface Node {
        parent: Node
        name: string
        id: number
        children: Node[]
    }
    const temporaryTable: Node[] = []
    function addNode(info: mz.DataMapInfo): Node {
        return {
            name: info.name,
            id: info.id,
            parent: addNode(mz.$dataMapInfos[info.parentId]),
            children: []
        }
    }
    for (const info of mz.$dataMapInfos) {
        temporaryTable.push(addNode(info))
    }
}

interface MapTable {
    [name: string]: {
        id: number
        children: MapTable[]
    }
}

const mapTable: MapTable | null = param.mapTable ? solveMapTable() : null

TrueWay.getMapByName = function(name) {
    if (mapTable === null) throw new TrueWayError(`${TrueWay.getMapByName!.name} unavailable. Particular configuration required`)
    if (!(name in mapTable)) throw new TrueWayError(`Map ${name} is not a top map. Can not use ${TrueWay.getMapByName!.name}`)
    return TrueWay.getMapById!(mapTable[name].id)
}

TrueWay.getMapCurrent = function() {
    return TrueWay.getMapById!(mz.$gameMap.mapId())
}


let pattern: RegExp

if (param.onEnter) {
    const label = escape(String(param.onEnter))
    pattern = genReg(label)
}

const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)
    const map = TrueWay.getMapCurrent!()
    if (param.map) {
        // @ts-ignore
        window[param.map] = map
    }
    if (param.onEnter) {
        const match = mz.$dataMap.note.match(pattern)
        if (match !== null) {
            const script = match[1]
            const func = new Function(script)
            func()
        }
    }
    map.entered = true
}
