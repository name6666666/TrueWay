import mz from 'rmmz'
import { MapData, TrueWayData, TrueWayError } from './true-way'


declare module 'rmmz' {
    interface SaveContents {
        name6666666_TrueWay: TrueWayData
    }
}

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    for (const info of mz.$dataMapInfos) {
        if (!info) continue
        const path = `data/Map${String(info.id).padStart(3, '0')}.json`
        fetch(path).then(res => {
            if (!res.ok) throw new TrueWayError(`When fetching ${path}: ${res.status} ${res.statusText}`)
            return res.json()
        }).then(data => {
            const mapData: MapData = {mapVars: {}}
            for (const e of data.events) {
                if (!e) continue
                mapData[e.id] = {}
            }
            TrueWay._data![info.id] = mapData
        }).catch(e => {throw e})
    }
}

const _makeSaveContents = mz.DataManager.makeSaveContents
mz.DataManager.makeSaveContents = function() {
    const ret =  _makeSaveContents.call(this)
    ret.name6666666_TrueWay = TrueWay._data!
    return ret
}

const _extractSaveContents = mz.DataManager.extractSaveContents
mz.DataManager.extractSaveContents = function(contents) {
    _extractSaveContents.call(this, contents)
    TrueWay._data = contents.name6666666_TrueWay
}
