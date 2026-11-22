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

    var _createGameObjects = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects.call(this);
        TrueWay._data = {};
    };
    var _makeSaveContents = mz.DataManager.makeSaveContents;
    mz.DataManager.makeSaveContents = function () {
        var ret = _makeSaveContents.call(this);
        ret.name6666666_TrueWay = TrueWay._data;
        return ret;
    };
    mz.DataManager.extractSaveContents;
    mz.DataManager.extractSaveContents = function (contents) {
        TrueWay._data = contents.name6666666_TrueWay;
    };

})(window);
