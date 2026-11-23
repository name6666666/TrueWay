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
 * mapAttr.parent
 * 内置属性————parent，值为父地图的属性管理器
 * mapAttr.entered
 * 内置属性————entered，值为是否进入过此地图
 * 
 * @url 6767
 * 
 * @param map
 * @text 对应当前地图的全局变量
 * @desc 设置一个全局变量，它总是当前地图的属性管理器，为空禁用
 * @type text
 * @default map
 * 
 * @param self
 * @text 对应当前事件的全局变量
 * @desc 设置一个全局变量，它总是当前事件的属性管理器，为空禁用
 * @type text
 * @default self
 * 
 * @param onEnter
 * @text 进入地图脚本标签
 * @desc 进入地图时，在所有事件开始判定之间就执行的脚本的标签
 * @type text
 * @default on-enter
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

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
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
    // @ts-ignore
    window.TrueWay = {
        Error: TrueWayError
    };
    var param = mz.PluginManager.parameters('TrueWay');
    function genReg(label) {
        return new RegExp(String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["<", ">(((?!(</", ">))[sS])*?)</", ">"], ["<", ">(((?!(</", ">))[\\s\\S])*?)</", ">"])), label, label, label));
    }
    var templateObject_1;

    var _createGameObjects = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects.call(this);
        TrueWay._data = {};
        var _loop_1 = function (info) {
            if (!info)
                return "continue";
            var path = "data/Map".concat(String(info.id).padStart(3, '0'), ".json");
            fetch(path).then(function (res) {
                if (!res.ok)
                    throw new TrueWayError("When fetching ".concat(path, ": ").concat(res.status, " ").concat(res.statusText));
                return res.json();
            }).then(function (data) {
                var mapData = { mapVars: {} };
                for (var _i = 0, _a = data.events; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (!e)
                        continue;
                    mapData[e.id] = {};
                }
                TrueWay._data[info.id] = mapData;
            }).catch(function (e) { throw e; });
        };
        for (var _i = 0, _a = mz.$dataMapInfos; _i < _a.length; _i++) {
            var info = _a[_i];
            _loop_1(info);
        }
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

    function escapeStringRegexp(string) {
    	if (typeof string !== 'string') {
    		throw new TypeError('Expected a string');
    	}

    	// Escape characters with special meaning either inside or outside character sets.
    	// Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
    	return string
    		.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
    		.replace(/-/g, '\\x2d');
    }

    function getEventByMapIdAndEventId(mapId, eventId) {
        // @ts-ignore
        return new Proxy({}, {
            get: function (target, p, receiver) {
                var ret = Reflect.get(TrueWay._data[mapId][eventId], p);
                if (ret === undefined) {
                    switch (p) {
                        case 'map': TrueWay.getMapById(mapId);
                    }
                    throw new TrueWayError("Unknown attribute ".concat(String(p), ", when access map ").concat(mapId, " event ").concat(eventId));
                }
                return ret;
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError("Can not assign attribute ".concat(String(p), " as undefined, when access map ").concat(mapId, " event ").concat(eventId));
                }
                return Reflect.set(TrueWay._data[mapId][eventId], p, newValue);
            }
        });
    }

    function parent(id) {
        var newId = mz.$dataMapInfos[id].parentId;
        if (newId === 0)
            throw new TrueWayError("Map ".concat(id, " has no parent"));
        return TrueWay.getMapById(newId);
    }
    // @ts-ignore
    TrueWay.getMapById = function (id) {
        if (!(id in TrueWay._data))
            throw new TrueWayError("Unknown map id ".concat(id));
        return new Proxy({}, {
            get: function (target, p, receiver) {
                var ret = Reflect.get(TrueWay._data[id].mapVars, p);
                if (ret === undefined) {
                    switch (p) {
                        case 'id': return id;
                        case 'parent': return parent(id);
                        case 'entered': return false;
                        case 'getEventById': return function (eventId) {
                            return getEventByMapIdAndEventId(id, eventId);
                        };
                    }
                    throw new TrueWayError("Unknown attribute ".concat(String(p), ", when access map ").concat(id));
                }
                return ret;
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError("Can not assign attribute ".concat(String(p), " as undefined, when access map ").concat(id));
                }
                return Reflect.set(TrueWay._data[id].mapVars, p, newValue);
            }
        });
    };
    TrueWay.getMapCurrent = function () {
        return TrueWay.getMapById(mz.$gameMap.mapId());
    };
    var pattern;
    if (param.onEnter) {
        var label = escapeStringRegexp(String(param.onEnter));
        pattern = genReg(label);
    }
    var _Game_Map_setup = mz.Game_Map.prototype.setup;
    mz.Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);
        var map = TrueWay.getMapCurrent();
        if (param.map) {
            // @ts-ignore
            window[param.map] = map;
        }
        if (param.onEnter) {
            var match = mz.$dataMap.note.match(pattern);
            if (match !== null) {
                var script = match[1];
                var func = new Function(script);
                func();
            }
        }
        map.entered = true;
    };

})(window);
