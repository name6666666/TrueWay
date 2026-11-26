import mz from 'rmmz'
import { param, TrueWayError } from './true-way.ts'
import { MapAttr } from './map-attr.ts'
import onChange from 'on-change'


export interface EventAttr extends EventAttrBase {
    [attr: string]: any
    a: boolean
    b: boolean
    c: boolean
    d: boolean
}

export class EventAttrBase {
    mapId: number
    id: number
    constructor(mapId: number, eventId: number) {
        this.mapId = mapId
        this.id = eventId
    }
    get map(): MapAttr {
        return TrueWay.getMapById!(this.mapId)
    }
    findEvent(x: number, y: number): EventAttr {
        const dataMapAll = TrueWay.$dataMapAll!
        const events = dataMapAll[this.mapId].events
        const [selfX, selfY] = [events[this.id].x, events[this.id].y]
        const target = events.find((v, _i, _o) => {
            if (!v) return false
            return (v.x === (selfX + x)) && (v.y === (selfY + y))
        })
        if (target === undefined) throw new TrueWayError(
            `Map ${this.mapId} event ${this.id} can not find (${x}, ${y})`
        )
        return getEventByMapIdAndEventId(this.mapId, target.id)
    }
    static hasSetter(propName: string) {
        const descriptor = Object.getOwnPropertyDescriptor(this.prototype, propName);
        return descriptor && typeof descriptor.set === 'function';
    }
    static initProperties() {
        for (const name of ['A', 'B', 'C', 'D'] as const) {
            Object.defineProperty(EventAttrBase.prototype, name.toLowerCase(), {
                get: function() {
                    return mz.$gameSelfSwitches.value([this.mapId, this.id, name])
                },
                set: function(v: boolean) {
                    if (typeof v !== 'boolean') {
                        throw new TrueWayError(`Can not set map ${this.mapId} event ${this.id} switch ${name} to non-boolean`)
                    }
                    mz.$gameSelfSwitches.setValue([this.mapId, this.id, name], v)
                }
            })
        }
    }
}
EventAttrBase.initProperties()

declare module './true-way.ts' {
    interface TrueWayType {
        EventAttrBase: typeof EventAttrBase
    }
}

TrueWay.EventAttrBase = EventAttrBase

export function getEventByMapIdAndEventId(mapId: number, eventId: number): EventAttr {
    if (TrueWay._data!?.[mapId]?.[eventId] === undefined) {
        throw new TrueWayError(`Map ${mapId} event ${eventId} dose not exist`)
    }
    // @ts-expect-error
    return new Proxy(new EventAttrBase(mapId, eventId), {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![mapId][eventId], p)
            if (ret === undefined) {
                if (p in target) {
                    return Reflect.get(target, p, receiver)
                }
                throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${mapId} event ${eventId}`)
            }
            return ret
        },
        set: function(target, p, newValue) {
            if (newValue === undefined) {
                throw new TrueWayError(
                    `Can not assign attribute ${String(p)} as undefined, when access map ${mapId} event ${eventId}`
                )
            }
            if (EventAttrBase.hasSetter(p as string)) {
                return Reflect.set(target, p, newValue)
            }
            return Reflect.set(TrueWay._data![mapId][eventId], p, newValue)
        }
    })
}

mz.PluginManager.registerCommand('TrueWay', 'initEvent', () => {})

function initEvent(mapId: number, eventId: number, cmd: mz.DataCommand) {
    if ((cmd.parameters![0] === 'TrueWay') && (cmd.parameters![1] === 'initEvent')) {
        // @ts-ignore
        const script: string = cmd.parameters![3].script
        const self = getEventByMapIdAndEventId(mapId, eventId)
        const func = new Function(param.self, script)
        func(self)
    }
}

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    const dataMapAll = TrueWay.$dataMapAll!
    for (const i in dataMapAll) {
        const map = dataMapAll[i]
        for (const event of map.events) {
            if (!event) continue
            for (const page of event.pages) {
                for (const cmd of page.list) {
                    if (cmd.code !== 357) {
                        continue
                    }
                    initEvent(Number(i), event.id, cmd)
                }
            }
        }
    }
}

function getEventCurrent() {
    const mapId = mz.$gameMap.mapId()
    const eventId = mz.$gameMap._interpreter.eventId()
    return getEventByMapIdAndEventId(mapId, eventId)
}

// @ts-ignore
window[param.self] = new Proxy({}, {
    get: function(target, p, receiver) {
        const eventAttr = getEventCurrent!()
        return Reflect.get(eventAttr, p)
    },
    set: function(target, p, newValue) {
        const eventAttr = getEventCurrent!()
        return Reflect.set(eventAttr, p, newValue)
    }
})

declare module './true-way.ts' {
    interface TrueWayType {
        _currentTrueEvents: mz.Game_Event[]
    }
}

const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)
    TrueWay._currentTrueEvents = mz.$gameMap._events
    mz.$gameMap._events = onChange(TrueWay._currentTrueEvents, (path, value, previous, applyData) => {
        if (path !== '') return
        console.log(value)
    })
}
