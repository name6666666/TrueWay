import mz from 'rmmz'
import {param, TrueWayError} from './true-way'



interface MapAttr {
    [attr: string]: any
    id: number
    getParent: {(): MapAttr}
}

declare module './true-way' {
    interface TrueWayType {
        getMapById: {(id: number): MapAttr}
        getMapCurrent: {(): MapAttr}
    }
}


TrueWay.getMapById = function(id) {
    return new Proxy({
        id,
        getParent() {
            const newId = mz.$dataMapInfos[id].parentId
            return TrueWay.getMapById!(newId)
        }
    }, {
        get: function(target, p, receiver) {
            const ret = Reflect.get(TrueWay._data![target.id].mapVars, p)
            if (ret === undefined) {
                if (p in target) {
                    return Reflect.get(target, p, receiver)
                }
                throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${target.id}`)
            }
            return ret
        },
        set: function(target, p, newValue) {
            if (newValue === undefined) {
                throw new TrueWayError(`Can not assign attribute ${String(p)} as undefined, when access map ${target.id}`)
            }
            const scope = TrueWay._data![target.id].mapVars
            return Reflect.set(scope, p, newValue)
        }
    })
}

TrueWay.getMapCurrent = function() {
    return TrueWay.getMapById!(mz.$gameMap.mapId())
}

declare global {
    let map: MapAttr
}


const enabled = param.map === 'true'
if (enabled) {
    const _Game_Map_setup = mz.Game_Map.prototype.setup
    mz.Game_Map.prototype.setup = function(mapId) {
        _Game_Map_setup.call(this, mapId)
        // @ts-ignore
        window.map = TrueWay.getMapCurrent!()
    }
}
