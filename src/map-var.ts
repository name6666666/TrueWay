import mz from 'rmmz'
import {param, TrueWayError} from './true-way'



interface MapAttr {
    [attr: string]: any
    id: number
    parent: MapAttr
    entered: boolean
}

declare module './true-way' {
    interface TrueWayType {
        getMapById: {(id: number): MapAttr}
        getMapCurrent: {(): MapAttr}
    }
}

// @ts-ignore
TrueWay.getMapById = function(id) {
    if (!(id in TrueWay._data!)) throw new TrueWayError(`Unknown map id ${id}`)
    return new Proxy({
        parent() {
            const newId = mz.$dataMapInfos[id].parentId
            if (newId === 0) throw new TrueWayError(`Map ${id} has no parent`)
            return TrueWay.getMapById!(newId)
        }
    }, {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![id].mapVars, p)
            if (ret === undefined) {
                switch (p) {
                    case 'id': return id
                    case 'parent': return target.parent()
                    case 'entered': return false
                }
                throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${id}`)
            }
            return ret
        },
        set: function(target, p, newValue) {
            if (newValue === undefined) {
                throw new TrueWayError(`Can not assign attribute ${String(p)} as undefined, when access map ${id}`)
            }
            const scope = TrueWay._data![id].mapVars
            return Reflect.set(scope, p, newValue)
        }
    })
}

TrueWay.getMapCurrent = function() {
    return TrueWay.getMapById!(mz.$gameMap.mapId())
}

if (param.map) {
    const _Game_Map_setup = mz.Game_Map.prototype.setup
    mz.Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId)
        // @ts-ignore
        window[param.map] = TrueWay.getMapCurrent!()
    }
}
