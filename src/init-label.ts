import mz from 'rmmz'
import { MapData } from './true-way'
import escape from 'escape-string-regexp'


const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)
    if (TrueWay._data![mapId] === undefined) {
        let mapContent: MapData = {mapVars: {}}
        for (const e of mz.$gameMap.events()) {
            mapContent[e.eventId()] = {}
        }
        TrueWay._data![mapId] = mapContent
        parseComment()
    }
}


const label = escape(String(mz.PluginManager.parameters('TrueWay.js')['初始化标签']))
const pattern = new RegExp(`<${label}>(((?!(</${label}>))[\s\S])*?)</${label}>`)

function parseComment() {
    const match = mz.$dataMap.note.match(pattern)
    if (match === null) return
    const script = match[1]
    const func = new Function(script)
    func()
}
