import mz from 'rmmz'
import { TrueWayError } from './true-way'
import { MapAttr } from './map-attr'


export interface EventAttr {
    [attr: string]: any
    map: MapAttr
}

export function getEventByMapIdAndEventId(mapId: number, eventId: number): EventAttr {
    // @ts-ignore
    return new Proxy({}, {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![mapId][eventId], p)
            if (ret === undefined) {
                switch (p) {
                    case 'map': TrueWay.getMapById!(mapId)
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
