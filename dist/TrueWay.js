/*:
 * @target MZ
 * @plugindesc TrueWay支持你使用比mz原生变量系统更加可维护、更加工程化一百倍的新的变量系统编写mz工程
 * @author name6666666
 * 
 * @help The true way to use RPG maker mz!
 * 
 * mz的变量系统依赖gui界面，用gui创建删除变量，用gui一点一点拼接表达式，
 * 与眼花缭乱的临时全局变量打交道，这无疑是反工程化的，哪怕安装某些自身变
 * 量插件，它们未必充分利用js的Proxy简化表达式书写，就算有插件想到了这一点
 * ，它们也未必想得到TrueWay的true abstraction，事件可以有变量，地图为什
 * 么不可以有？为什么不让地图以父子关系，事件以位置关系作为相对关系，让相对
 * 关系作为纽带，把几个事件或几个地图抽象为一个整体的组件？
 * 
 * TrueWay.getMapById(id: number): MapAttr
 * 以地图id获取地图的属性管理器
 * 
 * TrueWay.getMapCurrent(): MapAttr
 * 获取当前地图的属性管理器
 * 
 * let mapAttr: MapAttr
 * mapAttr.foo
 * 获取属性
 * mapAttr.foo = 67
 * 设置属性
 * mapAttr.id
 * 内置属性————id，值为地图id
 * mapAttr.getParent
 * 内置属性————getParent，签名为(): MapAttr，获取父地图的属性管理器
 * 
 * 
 */
(function (mz) {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var TrueWayError = /** @class */ (function (_super) {
        __extends(TrueWayError, _super);
        function TrueWayError() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TrueWayError;
    }(Error));
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
    var TrueWay = {
        _data: data,
        Error: TrueWayError
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

    TrueWay.getMapById = function (id) {
        return new Proxy({
            id: id,
            getParent: function () {
                var newId = mz.$dataMapInfos[id].parentId;
                return TrueWay.getMapById(newId);
            }
        }, {
            get: function (target, p, receiver) {
                var ret = Reflect.get(TrueWay._data[target.id].mapVars, p);
                if (ret === undefined) {
                    if (p in target) {
                        return Reflect.get(target, p, receiver);
                    }
                    throw new TrueWayError("Unknown attribute ".concat(String(p), ", when access map ").concat(target.id));
                }
                return ret;
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError("Can not assign attribute ".concat(String(p), " as undefined, when access map ").concat(target.id));
                }
                var scope = TrueWay._data[target.id].mapVars;
                return Reflect.set(scope, p, newValue);
            }
        });
    };
    TrueWay.getMapCurrent = function () {
        return TrueWay.getMapById(mz.$gameMap.mapId());
    };

})(window);
