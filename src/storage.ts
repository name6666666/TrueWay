import mz from 'rmmz'
import { MapData, TrueWayData } from './true-way'
import fs from 'fs'


declare module 'rmmz' {
    interface SaveContents {
        name6666666_TrueWay: TrueWayData
    }
}

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    let initialData: TrueWayData = {}
    for (const info of mz.$dataMapInfos) {
        if (!info) continue
        const path = `data/Map${String(info.id).padStart(3, '0')}.json`
        const data: mz.DataMap = JSON.parse(fs.readFileSync(path, {encoding: 'utf-8'}))
        const mapData: MapData = {mapVars: {}}
        for (const e of data.events) {
            if (!e) continue
            mapData[e.id] = {}
        }
        initialData[info.id] = mapData
    }
    TrueWay._data = initialData
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
