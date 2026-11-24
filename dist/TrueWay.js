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
 * js接口：
 * 
 * TrueWay.getMapById(id: number): MapAttr
 * 用地图id获取地图的属性管理器
 * 
 * TrueWay.getTopMap(name: string): MapAttr
 * 用名称获取顶层地图的属性管理器
 * 
 * window.map: MapAttr
 * 全局变量map永远是当前地图的属性管理器
 * 
 * window.self: EventAttr
 * 全局变量self永远是当前事件的属性管理器
 * 
 * window.global: Global
 * 全局变量global是游戏全局变量管理器，以更方便的接口完成$gameVariables的功能
 * 
 * 对于一个地图的属性管理器mapAttr
 * mapAttr.foo
 * 获取属性
 * mapAttr.foo = 67
 * 设置属性
 * mapAttr.id
 * 内置属性，值为地图id
 * mapAttr.parent
 * 内置属性，值为父地图的属性管理器
 * mapAttr.entered
 * 内置属性，值为是否进入过此地图
 * mapAttr.getChild(name: string): MapAttr
 * 用名称获取子地图的属性管理器
 * mapAttr.getEventById(id: number): EventAttr
 * 用事件id获取地图里的事件的属性管理器
 * mapAttr.getEvent(name: string): EventAttr
 * 用事件名称获取地图里的事件的属性管理器
 * 
 * 对于一个事件的属性管理器eventAttr
 * eventAttr.foo
 * 获取属性
 * eventAttr.foo = 67
 * 设置属性
 * eventAttr.id
 * 内置属性，值为事件id
 * eventAttr.map
 * 内置属性，值为所属地图的属性管理器
 * 
 * 对于global
 * global.foo
 * 按名称读取变量
 * global.foo = 67
 * 按名称设置变量
 * 
 * 地图标签：
 * 
 * <onEnter>
 * if (map.entered) {
 *   console.log('这里来过了')
 * }
 * </onEnter>
 * onEnter会在每次切换或进入地图时被调用
 * 
 * <init>
 * map.myAttr = 67
 * console.log('属性已设置')
 * </init>
 * init会在游戏启动时被调用，且会注入此地图属性管理器变量
 * 
 * 文本标签：
 * 
 * “获得了药水\js[self.potion]瓶”
 * “\js[["[67"][0]]”
 * 用\js插入任意表达式，插值解析器能理解js词法，完美应对较复杂情况
 * 
 * 插件指令：
 * 
 * 初始化事件脚本指令的示例如下
 * 
 * 脚本 = self.myAttr = 67
 * console.log('属性已设置')
 * 
 * 在事件执行到它时，实际上只会执行一个空函数，它只用于在游戏启动阶段执行
 * 
 * @url https://github.com/name6666666/TrueWay
 * 
 * @param map
 * @text 对应当前地图的全局变量
 * @desc 设置一个全局变量，它总是当前地图的属性管理器
 * @type text
 * @default map
 * 
 * @param self
 * @text 对应当前事件的全局变量
 * @desc 设置一个全局变量，它总是当前事件的属性管理器
 * @type text
 * @default self
 * 
 * @param global
 * @text 游戏变量管理器的全局变量
 * @desc 设置一个全局变量，用来更方便地管理游戏变量，会为游戏变量名称建表，代价是无法创建同名变量，为空可禁用
 * @type text
 * @default global
 * 
 * @param onEnter
 * @text 进入地图脚本标签
 * @desc 进入地图时，在所有事件开始判定之间就执行的脚本的标签
 * @type text
 * @default onEnter
 * 
 * @param initMap
 * @text 初始化地图脚本标签
 * @desc 在游戏启动时为每个地图初始化属性的脚本的标签
 * @type text
 * @default init
 * 
 * @param js
 * @text 文本插值标签
 * @desc 为文本插入任意js表达式的标签
 * @type struct<InsertedExpression>
 * 
 * @command initEvent
 * @text 初始化事件脚本
 * @desc 编写在游戏启动时为事件初始化属性的脚本，不受事件系统约束，一定会在游戏刚启动时执行
 * @arg script
 * @text 脚本
 * @desc 在游戏启动时为事件初始化属性的脚本，不受事件系统约束，一定会在游戏刚启动时执行
 * @type multiline_string
 * 
 * @param mapTable
 * @text 地图名称建表
 * @desc 为地图名称建表，如此便能通过名称而非id获取地图属性管理器，代价是同一地图下无法创建同名子地图
 * @type boolean
 * @default true
 * @on yes
 * @off no
 * 
 * @param eventTable
 * @text 事件名称建表
 * @desc 为事件名称建表，如此便能通过名称而非id获取事件属性管理器，代价是同一地图下无法创建同名事件
 * @type boolean
 * @default true
 * @on yes
 * @off no
 */

/*~struct~InsertedExpression:
 *
 * @param label
 * @text 标签名
 * @type string
 * @default js
 * @desc 反斜杠后接着的标签名称
 * 
 * @param parentheses
 * @text 括号
 * @desc 标签名称后接着的括号，用来包裹js内容
 * @type select
 * @default []
 * @option 小括号
 * @value ()
 * @option 中括号
 * @value []
 * @option 大括号
 * @value {}
 */

(function (mz) {
    'use strict';

    class TrueWayError extends Error {
        constructor(message) {
            super(message);
            this.name = TrueWayError.name;
        }
    }
    // @ts-ignore
    window.TrueWay = {
        Error: TrueWayError
    };
    const originalParam = mz.PluginManager.parameters('TrueWay');
    originalParam.mapTable = originalParam.mapTable === 'true' ? true : false;
    originalParam.eventTable = originalParam.eventTable === 'true' ? true : false;
    // @ts-ignore
    const param = originalParam;
    const identifierRegex = /^[\p{ID_Start}\p{ID_Continue}]*$/u;
    for (const ident of [
        param.map, param.self, param.onEnter, param.initMap, param.js.label
    ]) {
        const match = ident.match(identifierRegex);
        if (match === null) {
            throw new TrueWayError(`Invailid identifier ${JSON.stringify(ident)}`);
        }
    }
    if (param.global) {
        const match = param.global.match(identifierRegex);
        if (match === null) {
            throw new TrueWayError(`Invailid identifier ${JSON.stringify(param.global)}`);
        }
    }
    else {
        param.global = null;
    }
    if (!(param.js.parentheses in ['[]', '()', '{}'])) {
        throw new TrueWayError(`Invailid parentheses ${param.js.parentheses}`);
    }
    function genReg(label) {
        return new RegExp(String.raw `<${label}>(((?!(</${label}>))[\s\S])*?)</${label}>`, 'g');
    }

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    /* eslint-env browser */

    var browser;
    var hasRequiredBrowser;

    function requireBrowser () {
    	if (hasRequiredBrowser) return browser;
    	hasRequiredBrowser = 1;
    	const textEncoder = new TextEncoder();
    	const textDecoder = new TextDecoder();

    	function syncFetch (...args) {
    	  const request = new syncFetch.Request(...args);

    	  const xhr = new XMLHttpRequest();
    	  xhr.withCredentials = request.credentials === 'include';
    	  xhr.timeout = request[INTERNALS].timeout;

    	  // Request
    	  xhr.open(request.method, request.url, false);

    	  let useBinaryEncoding = false;
    	  try {
    	    // Only allowed in Worker scope, not available in older browsers
    	    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType#Synchronous_XHR_restrictions
    	    xhr.responseType = 'arraybuffer';
    	  } catch (e) {
    	    // Not in Worker scope; instead, attempt this alternative method
    	    // https://web.archive.org/web/20071103070418/http://mgran.blogspot.com/2006/08/downloading-binary-streams-with.html
    	    xhr.overrideMimeType('text/plain; charset=x-user-defined');
    	    useBinaryEncoding = true;
    	  }

    	  for (const header of request.headers) {
    	    xhr.setRequestHeader(...header);
    	  }

    	  xhr.send(request[INTERNALS].body || null);

    	  // Response
    	  let headers = xhr.getAllResponseHeaders();
    	  headers = headers && headers.split('\r\n').filter(Boolean).map(header => header.split(': ', 2));

    	  let body = xhr.response;
    	  if (useBinaryEncoding) {
    	    const buffer = new Uint8Array(body.length);
    	    for (let i = 0; i < body.length; i++) {
    	      buffer[i] = body.charCodeAt(i) & 0xff;
    	    }
    	    body = buffer;
    	  }

    	  const response = new syncFetch.Response(body, {
    	    headers,
    	    status: xhr.status,
    	    statusText: xhr.statusText
    	  });

    	  response[INTERNALS].url = xhr.responseURL;
    	  response[INTERNALS].redirected = xhr.responseURL !== request.url;

    	  return response
    	}

    	const INTERNALS = Symbol('SyncFetch Internals');
    	const REQ_UNSUPPORTED = ['mode', 'cache', 'redirect', 'referrer', 'integrity'];
    	const HTTP_STATUS = {
    	  100: 'Continue',
    	  101: 'Switching Protocols',
    	  200: 'OK',
    	  201: 'Created',
    	  202: 'Accepted',
    	  203: 'Non-Authoritative Information',
    	  204: 'No Content',
    	  205: 'Reset Content',
    	  206: 'Partial Content',
    	  300: 'Multiple Choices',
    	  301: 'Moved Permanently',
    	  302: 'Found',
    	  303: 'See Other',
    	  304: 'Not Modified',
    	  305: 'Use Proxy',
    	  307: 'Temporary Redirect',
    	  400: 'Bad Request',
    	  401: 'Unauthorized',
    	  402: 'Payment Required',
    	  403: 'Forbidden',
    	  404: 'Not Found',
    	  405: 'Method Not Allowed',
    	  406: 'Not Acceptable',
    	  407: 'Proxy Authentication Required',
    	  408: 'Request Timeout',
    	  409: 'Conflict',
    	  410: 'Gone',
    	  411: 'Length Required',
    	  412: 'Precondition Failed',
    	  413: 'Payload Too Large',
    	  414: 'URI Too Long',
    	  415: 'Unsupported Media Type',
    	  416: 'Range Not Satisfiable',
    	  417: 'Expectation Failed',
    	  426: 'Upgrade Required',
    	  500: 'Internal Server Error',
    	  501: 'Not Implemented',
    	  502: 'Bad Gateway',
    	  503: 'Service Unavailable',
    	  504: 'Gateway Timeout',
    	  505: 'HTTP Version Not Supported'
    	};

    	class SyncRequest {
    	  constructor (resource, init = {}) {
    	    for (const option of REQ_UNSUPPORTED) {
    	      if (option in init) {
    	        throw new TypeError(`option ${option} not supported`)
    	      }
    	    }

    	    if (init.credentials === 'same-origin') {
    	      throw new TypeError('option credentials with value \'same-origin\' not supported')
    	    }

    	    this[INTERNALS] = {
    	      method: init.method || 'GET',
    	      headers: new syncFetch.Headers(init.headers),
    	      body: parseBody(init.body),
    	      credentials: init.credentials || 'omit',

    	      // Non-spec
    	      timeout: init.timeout || 0
    	    };

    	    if (typeof resource === 'string') {
    	      this[INTERNALS].url = resource;
    	    } else if (resource instanceof SyncRequest) {
    	      this[INTERNALS].url = resource.url;
    	      if (!init.method) {
    	        this[INTERNALS].method = resource.method;
    	      }
    	      if (!init.headers) {
    	        this[INTERNALS].headers = resource.headers;
    	      }
    	      if (!init.body) {
    	        this[INTERNALS].body = resource[INTERNALS].body;
    	      }
    	      if (!init.credentials) {
    	        this[INTERNALS].credentials = resource.credentials;
    	      }
    	    } else {
    	      throw new TypeError('Request input should be a URL string or a Request object')
    	    }
    	  }

    	  get cache () {
    	    return 'default'
    	  }

    	  get credentials () {
    	    return this[INTERNALS].credentials
    	  }

    	  get destination () {
    	    return ''
    	  }

    	  get headers () {
    	    return this[INTERNALS].headers
    	  }

    	  get integrity () {
    	    return ''
    	  }

    	  get method () {
    	    return this[INTERNALS].method
    	  }

    	  get mode () {
    	    return 'cors'
    	  }

    	  get priority () {
    	    return 'auto'
    	  }

    	  get redirect () {
    	    return 'follow'
    	  }

    	  get referrer () {
    	    return 'about:client'
    	  }

    	  get referrerPolicy () {
    	    return ''
    	  }

    	  get url () {
    	    return this[INTERNALS].url
    	  }

    	  clone () {
    	    checkBody(this);
    	    return new SyncRequest(this.url, this[INTERNALS])
    	  }
    	}

    	class SyncResponse {
    	  constructor (body, init = {}) {
    	    this[INTERNALS] = {
    	      body: parseBody(body),
    	      bodyUsed: false,

    	      headers: new syncFetch.Headers(init.headers),
    	      status: init.status,
    	      statusText: init.statusText
    	    };
    	  }

    	  get headers () {
    	    return this[INTERNALS].headers
    	  }

    	  get ok () {
    	    const status = this[INTERNALS].status;
    	    return status >= 200 && status < 300
    	  }

    	  get redirected () {
    	    return this[INTERNALS].redirected
    	  }

    	  get status () {
    	    return this[INTERNALS].status
    	  }

    	  get statusText () {
    	    return this[INTERNALS].statusText
    	  }

    	  get url () {
    	    return this[INTERNALS].url
    	  }

    	  clone () {
    	    return this.redirect(this[INTERNALS].url, this[INTERNALS].status)
    	  }

    	  redirect (url, status) {
    	    checkBody(this);

    	    const response = new SyncResponse(this[INTERNALS].body, {
    	      headers: this[INTERNALS].headers,
    	      status: status || this[INTERNALS].status,
    	      statusText: HTTP_STATUS[status] || this[INTERNALS].statusText
    	    });

    	    response[INTERNALS].url = url || this[INTERNALS].url;
    	    response[INTERNALS].redirected = this[INTERNALS].redirected;

    	    return response
    	  }
    	}

    	class Body {
    	  constructor (body) {
    	    this[INTERNALS] = {
    	      body: parseBody(body),
    	      bodyUsed: false
    	    };
    	  }

    	  get bodyUsed () {
    	    return this[INTERNALS].bodyUsed
    	  }

    	  static mixin (prototype) {
    	    for (const name of Object.getOwnPropertyNames(Body.prototype)) {
    	      if (name === 'constructor') { continue }
    	      const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
    	      Object.defineProperty(prototype, name, { ...desc, enumerable: true });
    	    }
    	  }

    	  arrayBuffer () {
    	    const buffer = consumeBody(this);
    	    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
    	  }

    	  blob () {
    	    const type = this.headers && this.headers.get('content-type');
    	    return new Blob([consumeBody(this)], type && { type })
    	  }

    	  text () {
    	    return textDecoder.decode(consumeBody(this))
    	  }

    	  json () {
    	    try {
    	      return JSON.parse(this.text())
    	    } catch (err) {
    	      throw new TypeError(`invalid json response body at ${this.url} reason: ${err.message}`, 'invalid-json')
    	    }
    	  }
    	}

    	function checkBody (body) {
    	  if (body.bodyUsed) {
    	    throw new TypeError(`body used already for: ${body.url}`)
    	  }
    	}

    	function consumeBody (body) {
    	  checkBody(body);
    	  body[INTERNALS].bodyUsed = true;
    	  return body[INTERNALS].body || new Uint8Array()
    	}

    	function parseBody (body) {
    	  if (typeof body === 'string') {
    	    return textEncoder.encode(body)
    	  } else if (body) {
    	    return body
    	  } else {
    	    return null
    	  }
    	}

    	Body.mixin(SyncRequest.prototype);
    	Body.mixin(SyncResponse.prototype);

    	class Headers {
    	  constructor (headers) {
    	    if (headers instanceof syncFetch.Headers) {
    	      this[INTERNALS] = { ...headers[INTERNALS] };
    	    } else {
    	      this[INTERNALS] = {};

    	      if (Array.isArray(headers)) {
    	        for (const [name, value] of headers) {
    	          this.append(name, value);
    	        }
    	      } else if (typeof headers === 'object') {
    	        for (const name in headers) {
    	          this.set(name, headers[name]);
    	        }
    	      }
    	    }
    	  }

    	  // modification
    	  append (name, value) {
    	    name = name.toLowerCase();
    	    if (!this[INTERNALS][name]) {
    	      this[INTERNALS][name] = [];
    	    }
    	    this[INTERNALS][name].push(value);
    	  }

    	  delete (name) {
    	    delete this[INTERNALS][name.toLowerCase()];
    	  }

    	  set (name, value) {
    	    this[INTERNALS][name.toLowerCase()] = [value];
    	  }

    	  // access
    	  entries () {
    	    const pairs = [];
    	    for (const name in this[INTERNALS]) {
    	      for (const value of this[INTERNALS][name]) {
    	        pairs.push([name, value]);
    	      }
    	    }
    	    return pairs
    	  }

    	  get (name) {
    	    name = name.toLowerCase();
    	    return name in this[INTERNALS] ? this[INTERNALS][name].join(', ') : null
    	  }

    	  keys () {
    	    return Object.keys(this[INTERNALS])
    	  }

    	  has (name) {
    	    return name.toLowerCase() in this[INTERNALS]
    	  }

    	  values () {
    	    const values = [];
    	    for (const name in this[INTERNALS]) {
    	      for (const value of this[INTERNALS][name]) {
    	        values.push(value);
    	      }
    	    }
    	    return values
    	  }

    	  * [Symbol.iterator] () {
    	    for (const name in this[INTERNALS]) {
    	      for (const value of this[INTERNALS][name]) {
    	        yield [name, value];
    	      }
    	    }
    	  }
    	}

    	syncFetch.Headers = Headers;
    	syncFetch.Request = SyncRequest;
    	syncFetch.Response = SyncResponse;
    	browser = syncFetch;
    	return browser;
    }

    var browserExports = requireBrowser();
    var fetchSync = /*@__PURE__*/getDefaultExportFromCjs(browserExports);

    const _createGameObjects$3 = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects$3.call(this);
        TrueWay._data = {};
        TrueWay.$dataMapAll = [];
        for (const info of mz.$dataMapInfos) {
            if (!info)
                continue;
            const path = `data/Map${String(info.id).padStart(3, '0')}.json`;
            const data = fetchSync(path).json();
            const mapData = { mapVars: {} };
            for (const e of data.events) {
                if (!e)
                    continue;
                mapData[e.id] = {};
            }
            TrueWay._data[info.id] = mapData;
            TrueWay.$dataMapAll[info.id] = data;
        }
    };
    const _makeSaveContents = mz.DataManager.makeSaveContents;
    mz.DataManager.makeSaveContents = function () {
        const ret = _makeSaveContents.call(this);
        ret.name6666666_TrueWay = TrueWay._data;
        return ret;
    };
    const _extractSaveContents = mz.DataManager.extractSaveContents;
    mz.DataManager.extractSaveContents = function (contents) {
        _extractSaveContents.call(this, contents);
        TrueWay._data = contents.name6666666_TrueWay;
    };

    function solveMapTable() {
        const temporaryTable = {};
        function addNode(info) {
            if (info.id in temporaryTable)
                return temporaryTable[info.id];
            if (info.parentId === 0) {
                const ret = {
                    name: info.name,
                    id: info.id,
                    parent: null,
                    children: []
                };
                temporaryTable[ret.id] = ret;
                return ret;
            }
            const parent = addNode(mz.$dataMapInfos[info.parentId]);
            temporaryTable[parent.id] = parent;
            const ret = {
                name: info.name,
                id: info.id,
                parent,
                children: []
            };
            parent.children.push(ret);
            temporaryTable[ret.id] = ret;
            return ret;
        }
        for (const info of mz.$dataMapInfos) {
            if (!info)
                continue;
            addNode(info);
        }
        const mapTable = {};
        const root = [];
        for (const id in temporaryTable) {
            const node = temporaryTable[id];
            if (node.parent === null)
                root.push(node);
        }
        function addMapTable(table, node) {
            const children = {};
            for (const child of node.children) {
                addMapTable(children, child);
            }
            if (node.name in table) {
                throw new TrueWayError(`Duplicated map name ${JSON.stringify(node.name)}. Modify name or disable the key feature to pass`);
            }
            table[node.name] = {
                id: node.id,
                children
            };
        }
        for (const n of root) {
            addMapTable(mapTable, n);
        }
        const inverseMapTable = {};
        function addInverseMapTable(table, path) {
            for (const name in table) {
                const map = table[name];
                const newPath = [...path, name];
                inverseMapTable[map.id] = newPath;
                addInverseMapTable(map.children, newPath);
            }
        }
        addInverseMapTable(mapTable, []);
        return [mapTable, inverseMapTable];
    }
    function solveEventTable() {
        const dataMapAll = TrueWay.$dataMapAll;
        const ret = {};
        for (const i in dataMapAll) {
            const map = dataMapAll[i];
            const events = {};
            for (const e of map.events) {
                if (!e)
                    continue;
                if (e.name in events) {
                    throw new TrueWayError(`Duplicated event name ${JSON.stringify(e.name)}. Modify name or disable the key feature to pass`);
                }
                events[e.name] = e.id;
            }
            ret[i] = events;
        }
        return ret;
    }

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


    function __classPrivateFieldGet(receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    }

    function __classPrivateFieldSet(receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var _EventAttrBase_mapId;
    class EventAttrBase {
        constructor(mapId, eventId) {
            _EventAttrBase_mapId.set(this, void 0);
            __classPrivateFieldSet(this, _EventAttrBase_mapId, mapId, "f");
            this.id = eventId;
        }
        get map() {
            return TrueWay.getMapById(__classPrivateFieldGet(this, _EventAttrBase_mapId, "f"));
        }
        findEvent(x, y) {
            const dataMapAll = TrueWay.$dataMapAll;
            const events = dataMapAll[__classPrivateFieldGet(this, _EventAttrBase_mapId, "f")].events;
            const [selfX, selfY] = [events[this.id].x, events[this.id].y];
            const target = events.find((v, _i, _o) => {
                return (v.x === (selfX + x)) && (v.y === (selfY + y));
            });
            if (target === undefined)
                throw new TrueWayError(`Map ${__classPrivateFieldGet(this, _EventAttrBase_mapId, "f")} event ${this.id} can not find (${x}, ${y})`);
            return getEventByMapIdAndEventId(__classPrivateFieldGet(this, _EventAttrBase_mapId, "f"), target.id);
        }
    }
    _EventAttrBase_mapId = new WeakMap();
    TrueWay.EventAttrBase = EventAttrBase;
    function getEventByMapIdAndEventId(mapId, eventId) {
        if (TrueWay._data?.[mapId]?.[eventId] === undefined) {
            throw new TrueWayError(`Map ${mapId} event ${eventId} dose not exist`);
        }
        return new Proxy(new EventAttrBase(mapId, eventId), {
            get: function (target, p, receiver) {
                const ret = Reflect.get(TrueWay._data[mapId][eventId], p);
                if (ret === undefined) {
                    if (p in target) {
                        return Reflect.get(target, p, receiver);
                    }
                    throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${mapId} event ${eventId}`);
                }
                return ret;
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError(`Can not assign attribute ${String(p)} as undefined, when access map ${mapId} event ${eventId}`);
                }
                return Reflect.set(TrueWay._data[mapId][eventId], p, newValue);
            }
        });
    }
    mz.PluginManager.registerCommand('TrueWay', 'initEvent', () => { });
    function initEvent(mapId, eventId, cmd) {
        if ((cmd.parameters[0] === 'TrueWay') && (cmd.parameters[1] === 'initEvent')) {
            // @ts-ignore
            const script = cmd.parameters[3].script;
            const self = getEventByMapIdAndEventId(mapId, eventId);
            const func = new Function(param.self, script);
            func(self);
        }
    }
    const _createGameObjects$2 = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects$2.call(this);
        const dataMapAll = TrueWay.$dataMapAll;
        for (const i in dataMapAll) {
            const map = dataMapAll[i];
            for (const event of map.events) {
                if (!event)
                    continue;
                for (const page of event.pages) {
                    for (const cmd of page.list) {
                        if (cmd.code !== 357) {
                            continue;
                        }
                        initEvent(Number(i), event.id, cmd);
                    }
                }
            }
        }
    };
    function getEventCurrent() {
        const mapId = mz.$gameMap.mapId();
        const eventId = mz.$gameMap._interpreter.eventId();
        return getEventByMapIdAndEventId(mapId, eventId);
    }
    // @ts-ignore
    window[param.self] = new Proxy({}, {
        get: function (target, p, receiver) {
            const eventAttr = getEventCurrent();
            return Reflect.get(eventAttr, p);
        },
        set: function (target, p, newValue) {
            const eventAttr = getEventCurrent();
            return Reflect.set(eventAttr, p, newValue);
        }
    });

    class MapAttrBase {
        constructor(id) {
            this.entered = false;
            this.id = id;
        }
        getEventById(eventId) {
            return getEventByMapIdAndEventId(this.id, eventId);
        }
        getChild(name) {
            if (inverseMapTable === null || mapTable === null) {
                throw new TrueWayError(`${this.getChild.name} unavailable. Particular configuration required`);
            }
            const path = [...inverseMapTable[this.id], name];
            let target = mapTable[path[0]];
            for (const i in path) {
                if (i === '0')
                    continue;
                const part = path[i];
                target = target.children[part];
            }
            if (!target)
                throw new TrueWayError(`Unknown map name ${name}`);
            return TrueWay.getMapById(target.id);
        }
        getEvent(name) {
            if (eventTable === null) {
                throw new TrueWayError(`${this.getEvent.name} unavailable. Particular configuration required`);
            }
            const events = eventTable[this.id];
            if (!(name in events))
                throw new TrueWayError(`Unknown event name ${name}`);
            const eventId = events[name];
            return getEventByMapIdAndEventId(this.id, eventId);
        }
        get parent() {
            const newId = mz.$dataMapInfos[this.id].parentId;
            if (newId === 0)
                throw new TrueWayError(`Map ${this.id} has no parent`);
            return TrueWay.getMapById(newId);
        }
    }
    TrueWay.MapAttrBase = MapAttrBase;
    let mapTable;
    let inverseMapTable;
    let eventTable;
    const _createGameObjects$1 = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects$1.call(this);
        let [a, b] = param.mapTable ? solveMapTable() : [null, null];
        mapTable = a;
        inverseMapTable = b;
        eventTable = param.eventTable ? solveEventTable() : null;
        initAttr();
    };
    if (!param.initMap)
        throw new TrueWayError('Parameter error. Essential label required');
    const initAttrPattern = genReg(param.initMap);
    function initAttr() {
        const dataMapAll = TrueWay.$dataMapAll;
        for (const i in dataMapAll) {
            const map = TrueWay.getMapById(Number(i));
            const matches = dataMapAll[i].note.matchAll(initAttrPattern);
            for (const match of matches) {
                const script = match[1];
                const func = new Function(param.map, script);
                func(map);
            }
        }
    }
    TrueWay.getMapById = function (id) {
        if (!(id in TrueWay._data))
            throw new TrueWayError(`Unknown map id ${id}`);
        return new Proxy(new MapAttrBase(id), {
            get: function (target, p, receiver) {
                const ret = Reflect.get(TrueWay._data[id].mapVars, p);
                if (ret === undefined) {
                    if (p in target) {
                        return Reflect.get(target, p, receiver);
                    }
                    throw new TrueWayError(`Unknown attribute ${String(p)}, when access map ${id}`);
                }
                return ret;
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError(`Can not assign attribute ${String(p)} as undefined, when access map ${id}`);
                }
                return Reflect.set(TrueWay._data[id].mapVars, p, newValue);
            }
        });
    };
    TrueWay.getTopMap = function (name) {
        if (mapTable === null)
            throw new TrueWayError(`${TrueWay.getTopMap.name} unavailable. Particular configuration required`);
        if (!(name in mapTable))
            throw new TrueWayError(`Map ${name} is not a top map. Can not use ${TrueWay.getTopMap.name}`);
        return TrueWay.getMapById(mapTable[name].id);
    };
    function getMapCurrent() {
        return TrueWay.getMapById(mz.$gameMap.mapId());
    }
    const onEnterPattern = genReg(escapeStringRegexp(param.onEnter));
    const _Game_Map_setup = mz.Game_Map.prototype.setup;
    mz.Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);
        const map = getMapCurrent();
        // @ts-ignore
        window[param.map] = map;
        const matches = mz.$dataMap.note.matchAll(onEnterPattern);
        for (const match of matches) {
            const script = match[1];
            const func = new Function(script);
            func();
        }
        map.entered = true;
    };

    function createTable() {
        const table = {};
        for (const i in mz.$dataSystem.variables) {
            const v = mz.$dataSystem.variables[i];
            if (!v)
                continue;
            if (v in table) {
                throw new TrueWayError(`Duplicated global variable name ${v}. Modify name or disable the key feature to pass`);
            }
            table[v] = Number(i);
        }
        return table;
    }
    let table;
    const _createGameObjects = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects.call(this);
        table = createTable();
    };
    if (param.global !== null) {
        // @ts-ignore
        window[param.global] = new Proxy({}, {
            get: function (target, p, receiver) {
                return mz.$gameVariables.value(table[p]);
            },
            set: function (target, p, newValue) {
                mz.$gameVariables.setValue(table[p], newValue);
                return true;
            }
        });
    }

    var HashbangComment, Identifier, JSXIdentifier, JSXPunctuator, JSXString, JSXText, KeywordsWithExpressionAfter, KeywordsWithNoLineTerminatorAfter, LineTerminatorSequence, MultiLineComment, Newline, NumericLiteral, Punctuator, RegularExpressionLiteral, SingleLineComment, StringLiteral, Template, TokensNotPrecedingObjectLiteral, TokensPrecedingExpression, WhiteSpace, jsTokens;
    RegularExpressionLiteral = /\/(?![*\/])(?:\[(?:[^\]\\\n\r\u2028\u2029]+|\\.)*\]?|[^\/[\\\n\r\u2028\u2029]+|\\.)*(\/[$_\u200C\u200D\p{ID_Continue}]*|\\)?/yu;
    Punctuator = /--|\+\+|=>|\.{3}|\??\.(?!\d)|(?:&&|\|\||\?\?|[+\-%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2}|\/(?![\/*]))=?|[?~,:;[\](){}]/y;
    Identifier = /(\x23?)(?=[$_\p{ID_Start}\\])(?:[$_\u200C\u200D\p{ID_Continue}]+|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+/yu;
    StringLiteral = /(['"])(?:[^'"\\\n\r]+|(?!\1)['"]|\\(?:\r\n|[^]))*(\1)?/y;
    NumericLiteral = /(?:0[xX][\da-fA-F](?:_?[\da-fA-F])*|0[oO][0-7](?:_?[0-7])*|0[bB][01](?:_?[01])*)n?|0n|[1-9](?:_?\d)*n|(?:(?:0(?!\d)|0\d*[89]\d*|[1-9](?:_?\d)*)(?:\.(?:\d(?:_?\d)*)?)?|\.\d(?:_?\d)*)(?:[eE][+-]?\d(?:_?\d)*)?|0[0-7]+/y;
    Template = /[`}](?:[^`\\$]+|\\[^]|\$(?!\{))*(`|\$\{)?/y;
    WhiteSpace = /[\t\v\f\ufeff\p{Zs}]+/yu;
    LineTerminatorSequence = /\r?\n|[\r\u2028\u2029]/y;
    MultiLineComment = /\/\*(?:[^*]+|\*(?!\/))*(\*\/)?/y;
    SingleLineComment = /\/\/.*/y;
    HashbangComment = /^#!.*/;
    JSXPunctuator = /[<>.:={}]|\/(?![\/*])/y;
    JSXIdentifier = /[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}-]*/yu;
    JSXString = /(['"])(?:[^'"]+|(?!\1)['"])*(\1)?/y;
    JSXText = /[^<>{}]+/y;
    TokensPrecedingExpression = /^(?:[\/+-]|\.{3}|\?(?:InterpolationIn(?:JSX|Template)|NoLineTerminatorHere|NonExpressionParenEnd|UnaryIncDec))?$|[{}([,;<>=*%&|^!~?:]$/;
    TokensNotPrecedingObjectLiteral = /^(?:=>|[;\]){}]|else|\?(?:NoLineTerminatorHere|NonExpressionParenEnd))?$/;
    KeywordsWithExpressionAfter = /^(?:await|case|default|delete|do|else|in|instanceof|new|return|throw|typeof|void|yield)$/;
    KeywordsWithNoLineTerminatorAfter = /^(?:return|throw|yield)$/;
    Newline = RegExp(LineTerminatorSequence.source);
    jsTokens = function*(input, {jsx = false} = {}) {
    	var braces, firstCodePoint, isExpression, lastIndex, lastSignificantToken, length, match, mode, nextLastIndex, nextLastSignificantToken, parenNesting, postfixIncDec, punctuator, stack;
    	({length} = input);
    	lastIndex = 0;
    	lastSignificantToken = "";
    	stack = [
    		{tag: "JS"}
    	];
    	braces = [];
    	parenNesting = 0;
    	postfixIncDec = false;
    	if (match = HashbangComment.exec(input)) {
    		yield ({
    			type: "HashbangComment",
    			value: match[0]
    		});
    		lastIndex = match[0].length;
    	}
    	while (lastIndex < length) {
    		mode = stack[stack.length - 1];
    		switch (mode.tag) {
    			case "JS":
    			case "JSNonExpressionParen":
    			case "InterpolationInTemplate":
    			case "InterpolationInJSX":
    				if (input[lastIndex] === "/" && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken))) {
    					RegularExpressionLiteral.lastIndex = lastIndex;
    					if (match = RegularExpressionLiteral.exec(input)) {
    						lastIndex = RegularExpressionLiteral.lastIndex;
    						lastSignificantToken = match[0];
    						postfixIncDec = true;
    						yield ({
    							type: "RegularExpressionLiteral",
    							value: match[0],
    							closed: match[1] !== void 0 && match[1] !== "\\"
    						});
    						continue;
    					}
    				}
    				Punctuator.lastIndex = lastIndex;
    				if (match = Punctuator.exec(input)) {
    					punctuator = match[0];
    					nextLastIndex = Punctuator.lastIndex;
    					nextLastSignificantToken = punctuator;
    					switch (punctuator) {
    						case "(":
    							if (lastSignificantToken === "?NonExpressionParenKeyword") {
    								stack.push({
    									tag: "JSNonExpressionParen",
    									nesting: parenNesting
    								});
    							}
    							parenNesting++;
    							postfixIncDec = false;
    							break;
    						case ")":
    							parenNesting--;
    							postfixIncDec = true;
    							if (mode.tag === "JSNonExpressionParen" && parenNesting === mode.nesting) {
    								stack.pop();
    								nextLastSignificantToken = "?NonExpressionParenEnd";
    								postfixIncDec = false;
    							}
    							break;
    						case "{":
    							Punctuator.lastIndex = 0;
    							isExpression = !TokensNotPrecedingObjectLiteral.test(lastSignificantToken) && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken));
    							braces.push(isExpression);
    							postfixIncDec = false;
    							break;
    						case "}":
    							switch (mode.tag) {
    								case "InterpolationInTemplate":
    									if (braces.length === mode.nesting) {
    										Template.lastIndex = lastIndex;
    										match = Template.exec(input);
    										lastIndex = Template.lastIndex;
    										lastSignificantToken = match[0];
    										if (match[1] === "${") {
    											lastSignificantToken = "?InterpolationInTemplate";
    											postfixIncDec = false;
    											yield ({
    												type: "TemplateMiddle",
    												value: match[0]
    											});
    										} else {
    											stack.pop();
    											postfixIncDec = true;
    											yield ({
    												type: "TemplateTail",
    												value: match[0],
    												closed: match[1] === "`"
    											});
    										}
    										continue;
    									}
    									break;
    								case "InterpolationInJSX":
    									if (braces.length === mode.nesting) {
    										stack.pop();
    										lastIndex += 1;
    										lastSignificantToken = "}";
    										yield ({
    											type: "JSXPunctuator",
    											value: "}"
    										});
    										continue;
    									}
    							}
    							postfixIncDec = braces.pop();
    							nextLastSignificantToken = postfixIncDec ? "?ExpressionBraceEnd" : "}";
    							break;
    						case "]":
    							postfixIncDec = true;
    							break;
    						case "++":
    						case "--":
    							nextLastSignificantToken = postfixIncDec ? "?PostfixIncDec" : "?UnaryIncDec";
    							break;
    						case "<":
    							if (jsx && (TokensPrecedingExpression.test(lastSignificantToken) || KeywordsWithExpressionAfter.test(lastSignificantToken))) {
    								stack.push({tag: "JSXTag"});
    								lastIndex += 1;
    								lastSignificantToken = "<";
    								yield ({
    									type: "JSXPunctuator",
    									value: punctuator
    								});
    								continue;
    							}
    							postfixIncDec = false;
    							break;
    						default:
    							postfixIncDec = false;
    					}
    					lastIndex = nextLastIndex;
    					lastSignificantToken = nextLastSignificantToken;
    					yield ({
    						type: "Punctuator",
    						value: punctuator
    					});
    					continue;
    				}
    				Identifier.lastIndex = lastIndex;
    				if (match = Identifier.exec(input)) {
    					lastIndex = Identifier.lastIndex;
    					if (lastSignificantToken === "." || lastSignificantToken === "?.") {
    						// A property name, such as `a.default`, ends an expression even if
    						// it is a keyword.
    						nextLastSignificantToken = "?PropertyName";
    						postfixIncDec = true;
    					} else {
    						nextLastSignificantToken = match[0];
    						switch (match[0]) {
    							case "for":
    							case "if":
    							case "while":
    							case "with":
    								nextLastSignificantToken = "?NonExpressionParenKeyword";
    						}
    						postfixIncDec = !KeywordsWithExpressionAfter.test(match[0]);
    					}
    					lastSignificantToken = nextLastSignificantToken;
    					yield ({
    						type: match[1] === "#" ? "PrivateIdentifier" : "IdentifierName",
    						value: match[0]
    					});
    					continue;
    				}
    				StringLiteral.lastIndex = lastIndex;
    				if (match = StringLiteral.exec(input)) {
    					lastIndex = StringLiteral.lastIndex;
    					lastSignificantToken = match[0];
    					postfixIncDec = true;
    					yield ({
    						type: "StringLiteral",
    						value: match[0],
    						closed: match[2] !== void 0
    					});
    					continue;
    				}
    				NumericLiteral.lastIndex = lastIndex;
    				if (match = NumericLiteral.exec(input)) {
    					lastIndex = NumericLiteral.lastIndex;
    					lastSignificantToken = match[0];
    					postfixIncDec = true;
    					yield ({
    						type: "NumericLiteral",
    						value: match[0]
    					});
    					continue;
    				}
    				Template.lastIndex = lastIndex;
    				if (match = Template.exec(input)) {
    					lastIndex = Template.lastIndex;
    					lastSignificantToken = match[0];
    					if (match[1] === "${") {
    						lastSignificantToken = "?InterpolationInTemplate";
    						stack.push({
    							tag: "InterpolationInTemplate",
    							nesting: braces.length
    						});
    						postfixIncDec = false;
    						yield ({
    							type: "TemplateHead",
    							value: match[0]
    						});
    					} else {
    						postfixIncDec = true;
    						yield ({
    							type: "NoSubstitutionTemplate",
    							value: match[0],
    							closed: match[1] === "`"
    						});
    					}
    					continue;
    				}
    				break;
    			case "JSXTag":
    			case "JSXTagEnd":
    				JSXPunctuator.lastIndex = lastIndex;
    				if (match = JSXPunctuator.exec(input)) {
    					lastIndex = JSXPunctuator.lastIndex;
    					nextLastSignificantToken = match[0];
    					switch (match[0]) {
    						case "<":
    							stack.push({tag: "JSXTag"});
    							break;
    						case ">":
    							stack.pop();
    							if (lastSignificantToken === "/" || mode.tag === "JSXTagEnd") {
    								nextLastSignificantToken = "?JSX";
    								postfixIncDec = true;
    							} else {
    								stack.push({tag: "JSXChildren"});
    							}
    							break;
    						case "{":
    							stack.push({
    								tag: "InterpolationInJSX",
    								nesting: braces.length
    							});
    							nextLastSignificantToken = "?InterpolationInJSX";
    							postfixIncDec = false;
    							break;
    						case "/":
    							if (lastSignificantToken === "<") {
    								stack.pop();
    								if (stack[stack.length - 1].tag === "JSXChildren") {
    									stack.pop();
    								}
    								stack.push({tag: "JSXTagEnd"});
    							}
    					}
    					lastSignificantToken = nextLastSignificantToken;
    					yield ({
    						type: "JSXPunctuator",
    						value: match[0]
    					});
    					continue;
    				}
    				JSXIdentifier.lastIndex = lastIndex;
    				if (match = JSXIdentifier.exec(input)) {
    					lastIndex = JSXIdentifier.lastIndex;
    					lastSignificantToken = match[0];
    					yield ({
    						type: "JSXIdentifier",
    						value: match[0]
    					});
    					continue;
    				}
    				JSXString.lastIndex = lastIndex;
    				if (match = JSXString.exec(input)) {
    					lastIndex = JSXString.lastIndex;
    					lastSignificantToken = match[0];
    					yield ({
    						type: "JSXString",
    						value: match[0],
    						closed: match[2] !== void 0
    					});
    					continue;
    				}
    				break;
    			case "JSXChildren":
    				JSXText.lastIndex = lastIndex;
    				if (match = JSXText.exec(input)) {
    					lastIndex = JSXText.lastIndex;
    					lastSignificantToken = match[0];
    					yield ({
    						type: "JSXText",
    						value: match[0]
    					});
    					continue;
    				}
    				switch (input[lastIndex]) {
    					case "<":
    						stack.push({tag: "JSXTag"});
    						lastIndex++;
    						lastSignificantToken = "<";
    						yield ({
    							type: "JSXPunctuator",
    							value: "<"
    						});
    						continue;
    					case "{":
    						stack.push({
    							tag: "InterpolationInJSX",
    							nesting: braces.length
    						});
    						lastIndex++;
    						lastSignificantToken = "?InterpolationInJSX";
    						postfixIncDec = false;
    						yield ({
    							type: "JSXPunctuator",
    							value: "{"
    						});
    						continue;
    				}
    		}
    		WhiteSpace.lastIndex = lastIndex;
    		if (match = WhiteSpace.exec(input)) {
    			lastIndex = WhiteSpace.lastIndex;
    			yield ({
    				type: "WhiteSpace",
    				value: match[0]
    			});
    			continue;
    		}
    		LineTerminatorSequence.lastIndex = lastIndex;
    		if (match = LineTerminatorSequence.exec(input)) {
    			lastIndex = LineTerminatorSequence.lastIndex;
    			postfixIncDec = false;
    			if (KeywordsWithNoLineTerminatorAfter.test(lastSignificantToken)) {
    				lastSignificantToken = "?NoLineTerminatorHere";
    			}
    			yield ({
    				type: "LineTerminatorSequence",
    				value: match[0]
    			});
    			continue;
    		}
    		MultiLineComment.lastIndex = lastIndex;
    		if (match = MultiLineComment.exec(input)) {
    			lastIndex = MultiLineComment.lastIndex;
    			if (Newline.test(match[0])) {
    				postfixIncDec = false;
    				if (KeywordsWithNoLineTerminatorAfter.test(lastSignificantToken)) {
    					lastSignificantToken = "?NoLineTerminatorHere";
    				}
    			}
    			yield ({
    				type: "MultiLineComment",
    				value: match[0],
    				closed: match[1] !== void 0
    			});
    			continue;
    		}
    		SingleLineComment.lastIndex = lastIndex;
    		if (match = SingleLineComment.exec(input)) {
    			lastIndex = SingleLineComment.lastIndex;
    			postfixIncDec = false;
    			yield ({
    				type: "SingleLineComment",
    				value: match[0]
    			});
    			continue;
    		}
    		firstCodePoint = String.fromCodePoint(input.codePointAt(lastIndex));
    		lastIndex += firstCodePoint.length;
    		lastSignificantToken = firstCodePoint;
    		postfixIncDec = false;
    		yield ({
    			type: mode.tag.startsWith("JSX") ? "JSXInvalid" : "Invalid",
    			value: firstCodePoint
    		});
    	}
    	return void 0;
    };
    var jsTokens$1 = jsTokens;

    const begin = param.js.parentheses[0];
    const mark = `\x1b${param.js.label}${begin}`;
    const end = param.js.parentheses[1];
    function mzToNormal(text) {
        return text.replace(mzToNormal.pattern, (match, g1) => {
            switch (g1) {
                case '\x1b': return '\\';
                case '\\': return '\\\\';
                default: throw new TrueWayError('Unreachable. It is inner error');
            }
        });
    }
    mzToNormal.pattern = /(\x1b|\\)/g;
    function normalToMz(text) {
        return text.replace(normalToMz.p1, "\x1b").replace(normalToMz.p2, "\\");
    }
    normalToMz.p1 = /\\/g;
    normalToMz.p2 = /\x1b\x1b/g;
    function solveText(text) {
        const noMark = text.substring(mark.length);
        const tokens = jsTokens$1(mzToNormal(noMark));
        const tokenArr = [];
        for (const token of tokens)
            tokenArr.push(token);
        let script = '';
        let depth = 1;
        for (const i in tokenArr) {
            const token = tokenArr[i];
            if (token.type === 'Punctuator') {
                if (token.value === end) {
                    depth--;
                    if (depth === 0) {
                        let remain = '';
                        for (let j = Number(i) + 1; j < tokenArr.length; j++) {
                            remain += tokenArr[j].value;
                        }
                        return [String(window.eval(script)), normalToMz(remain)];
                    }
                    else
                        script += token.value;
                }
                else {
                    if (token.value === begin)
                        depth++;
                    script += token.value;
                }
            }
            else {
                script += token.value;
            }
        }
        throw new TrueWayError(`Boarderless inserted expression:\n ${mzToNormal(text)}`);
    }
    function computeInsert(text) {
        let newText = '';
        for (;;) {
            const i = text.indexOf(mark);
            if (i === -1) {
                newText += text;
                break;
            }
            newText += text.substring(0, i);
            const [result, remain] = solveText(text.substring(i));
            text = remain;
            newText += result;
            if (!text)
                break;
        }
        return newText;
    }
    const _Window_Base_convertEscapeCharacters = mz.Window_Base.prototype.convertEscapeCharacters;
    mz.Window_Base.prototype.convertEscapeCharacters = function (text) {
        text = _Window_Base_convertEscapeCharacters.call(this, text);
        return computeInsert(text);
    };

})(window);
