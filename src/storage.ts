import mz from 'rmmz'
import { TrueWayData } from './true-way'


declare module 'rmmz' {
    interface SaveContents {
        name6666666_TrueWay: TrueWayData
    }
}

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    TrueWay._data = {}
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
