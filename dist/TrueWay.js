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

    TrueWay = {
        _data: {}
    };
    var data = {};
    for (var _i = 0, _a = mz.$dataMapInfos; _i < _a.length; _i++) {
        var info = _a[_i];
        data[info.id] = { mapVars: {} };
    }
    function getEventIds(mapId) {
        var _b, _c, _d;
        return (_d = (_c = (_b = mz.$dataMap) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.map(function (event) { return event === null || event === void 0 ? void 0 : event.id; }).filter(function (id) { return id != null; })) !== null && _d !== void 0 ? _d : [];
    }
    getEventIds();
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
