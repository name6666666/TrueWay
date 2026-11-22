import mz from 'rmmz'
import { MapData } from './true-way'


const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)
    if (TrueWay._data![mapId] === undefined) {
        let mapContent: MapData = {mapVars: {}}
        for (const e of mz.$gameMap.events()) {
            mapContent[e.eventId()] = {}
        }
        TrueWay._data![mapId] = mapContent
    }
}
