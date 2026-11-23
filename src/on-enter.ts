import mz from 'rmmz'
import { param } from './true-way'
import './map-var'
import escape from 'escape-string-regexp'


let pattern: RegExp

if (param.onEnter) {
    const label = escape(String(param.onEnter))
    pattern = new RegExp(String.raw`<${label}>(((?!(</${label}>))[\s\S])*?)</${label}>`)
}

const _Game_Map_setup = mz.Game_Map.prototype.setup
mz.Game_Map.prototype.setup = function(mapId) {
    _Game_Map_setup.call(this, mapId)
    const map = TrueWay.getMapCurrent!()
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
