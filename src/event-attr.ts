import mz from 'rmmz'
import { param, TrueWayError } from './true-way'
import { MapAttr } from './map-attr'


export interface EventAttr extends EventAttrBase {
    [attr: string]: any
}

class EventAttrBase {
    #mapId: number
    constructor(mapId: number) {
        this.#mapId = mapId
    }
    get map(): MapAttr {
        return TrueWay.getMapById!(this.#mapId)
    }
}

export function getEventByMapIdAndEventId(mapId: number, eventId: number): EventAttr {
    if (TrueWay._data!?.[mapId]?.[eventId] === undefined) {
        throw new TrueWayError(`Map ${mapId} event ${eventId} dose not exist`)
    }
    return new Proxy(new EventAttrBase(mapId), {
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

declare module './true-way' {
    interface TrueWayType {
        getEventCurrent: {(): EventAttr}
    }
}

TrueWay.getEventCurrent = function() {
    const mapId = mz.$gameMap.mapId()
    const eventId = mz.$gameMap._interpreter.eventId()
    return getEventByMapIdAndEventId(mapId, eventId)
}

// @ts-ignore
window[param.self] = new Proxy({}, {
    get: function(target, p, receiver) {
        const eventAttr = TrueWay.getEventCurrent!()
        return Reflect.get(eventAttr, p)
    },
    set: function(target, p, newValue) {
        const eventAttr = TrueWay.getEventCurrent!()
        return Reflect.set(eventAttr, p, newValue)
    }
})
