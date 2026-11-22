import mz from 'rmmz'
import { MapData, param } from './true-way'
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


const label = escape(String(param.init))
const pattern = new RegExp(String.raw`<${label}>(((?!(</${label}>))[\s\S])*?)</${label}>`)
console.log(param.init)
function parseComment() {
    const match = mz.$dataMap.note.match(pattern)
    if (match === null) return
    const script = match[1]
    const func = new Function(script)
    func()
}
