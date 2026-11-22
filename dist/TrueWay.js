/*:
 * @target MZ
 * @plugindesc Description
 * @author Author
 * 
 * @help
 * 
 */
(function (mz) {
    'use strict';

    var data = {};
    for (var _i = 0, _a = mz.$dataMapInfos; _i < _a.length; _i++) {
        var info = _a[_i];
        data[info.id] = { mapVars: {} };
        var map = mz.$dataMap[info.id];
        for (var _b = 0, _c = map.events; _b < _c.length; _b++) {
            var event_1 = _c[_b];
            if (event_1 === null)
                continue;
            data[info.id][event_1.id] = {};
        }
    }
    TrueWay = {
        _data: data
    };
    var defaultData = data;

    var _createGameObjects = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects.call(this);
        TrueWay._data = defaultData;
    };
    var _makeSaveContents = mz.DataManager.makeSaveContents;
    mz.DataManager.makeSaveContents = function () {
        var ret = _makeSaveContents.call(this);
        ret.name6666666_TrueWay = TrueWay._data;
        return ret;
    };
    var _extractSaveContents = mz.DataManager.extractSaveContents;
    mz.DataManager.extractSaveContents = function (contents) {
        _extractSaveContents.call(this, contents);
        TrueWay._data = contents.name6666666_TrueWay;
    };

})(window);
