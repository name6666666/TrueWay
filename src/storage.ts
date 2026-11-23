import mz from 'rmmz'
import { MapData, TrueWayData, TrueWayError } from './true-way'


declare module 'rmmz' {
    interface SaveContents {
        name6666666_TrueWay: TrueWayData
    }
}

let isReady = false

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    TrueWay._data = {}
    isReady = false
    const promises: Promise<void>[] = []
    for (const info of mz.$dataMapInfos) {
        if (!info) continue
        const path = `data/Map${String(info.id).padStart(3, '0')}.json`
        const promise = fetch(path).then(res => {
            if (!res.ok) throw new TrueWayError(`When fetching ${path}: ${res.status} ${res.statusText}`)
            return res.json()
        }).then((data: mz.DataMap) => {
            const mapData: MapData = {mapVars: {}}
            for (const e of data.events) {
                if (!e) continue
                mapData[e.id] = {}
            }
            TrueWay._data![info.id] = mapData
        }).catch(e => {throw e})
        promises.push(promise)
    }
    Promise.all(promises).then(_ => {
        isReady = true
    }).catch(e => {throw e})
}

const _Scene_Map_isReady = mz.Scene_Map.prototype.isReady;
mz.Scene_Map.prototype.isReady = function() {
    return _Scene_Map_isReady.call(this) && isReady;
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
