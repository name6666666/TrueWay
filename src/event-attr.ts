import mz from 'rmmz'
import { TrueWayError } from './true-way'
import { MapAttr } from './map-attr'


interface EventAttr {
    [attr: string]: any
    map: MapAttr
}

function getEventByMapIdAndEventId(mapId: number, eventId: number): EventAttr {
    // @ts-ignore
    return new Proxy({}, {
        get: function(target, p, receiver) {

        },
        set: function(target, p, newValue) {
            return true
        }
    })
}
