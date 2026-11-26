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
 * eventAttr.mapId
 * 内置属性，值为所属地图的id
 * eventAttr.a eventAttr.b eventAttr.c eventAttr.d
 * 内置属性，访问独立开关
 * eventAttr.a = true
 * 可以设置独立开关
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
 * “挑逗引号"\js["114514"]，压根不怕”
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
 * @desc 设置一个全局变量，用来更方便地管理游戏变量和开关，会为游戏变量和开关名称建表，代价是无法创建同名开关或变量，为空可禁用
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
 * @default {"label":"js","parentheses":"[]"}
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
 * 
 * @param eventMonitor
 * @text 动态事件监控
 * @desc 监控新添加的动态事件，让它们也融入TrueWay的系统，适合配合其他动态事件插件（把TrueWay添加到最开头）
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

(function (exports, mz) {
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
    originalParam.eventMonitor = originalParam.eventMonitor === 'true' ? true : false;
    originalParam.js = JSON.parse(originalParam.js);
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
    if (!['[]', '()', '{}'].includes(param.js.parentheses)) {
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

    const PATH_SEPARATOR = '.';
    const TARGET = Symbol('target');
    const UNSUBSCRIBE = Symbol('unsubscribe');

    function isBuiltinWithMutableMethods(value) {
    	return value instanceof Date
    		|| value instanceof Set
    		|| value instanceof Map
    		|| value instanceof WeakSet
    		|| value instanceof WeakMap
    		|| ArrayBuffer.isView(value);
    }

    function isBuiltinWithoutMutableMethods(value) {
    	// Primitives and null → true. Functions → false. RegExp → true.
    	return value === null
    		|| (typeof value !== 'object' && typeof value !== 'function')
    		|| value instanceof RegExp
    		|| value instanceof ArrayBuffer
    		|| (typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer);
    }

    function isSymbol(value) {
    	return typeof value === 'symbol';
    }

    const path = {
    	after(path, subPath) {
    		if (Array.isArray(path)) {
    			return path.slice(subPath.length);
    		}

    		if (subPath === '') {
    			return path;
    		}

    		return path.slice(subPath.length + 1);
    	},
    	concat(path, key) {
    		if (Array.isArray(path)) {
    			path = [...path];

    			if (key) {
    				path.push(key);
    			}

    			return path;
    		}

    		if (key && key.toString !== undefined) {
    			if (path !== '') {
    				path += PATH_SEPARATOR;
    			}

    			if (isSymbol(key)) {
    				return path + key.toString();
    			}

    			return path + key;
    		}

    		return path;
    	},
    	initial(path) {
    		if (Array.isArray(path)) {
    			return path.slice(0, -1);
    		}

    		if (path === '') {
    			return path;
    		}

    		const index = path.lastIndexOf(PATH_SEPARATOR);

    		if (index === -1) {
    			return '';
    		}

    		return path.slice(0, index);
    	},
    	last(path) {
    		if (Array.isArray(path)) {
    			return path.at(-1) ?? '';
    		}

    		if (path === '') {
    			return path;
    		}

    		const index = path.lastIndexOf(PATH_SEPARATOR);

    		if (index === -1) {
    			return path;
    		}

    		return path.slice(index + 1);
    	},
    	walk(path, callback) {
    		if (Array.isArray(path)) {
    			for (const key of path) {
    				callback(key);
    			}
    		} else if (path !== '') {
    			let position = 0;
    			let index = path.indexOf(PATH_SEPARATOR);

    			if (index === -1) {
    				callback(path);
    			} else {
    				while (position < path.length) {
    					if (index === -1) {
    						index = path.length;
    					}

    					callback(path.slice(position, index));

    					position = index + 1;
    					index = path.indexOf(PATH_SEPARATOR, position);
    				}
    			}
    		}
    	},
    	get(object, path) {
    		this.walk(path, key => {
    			object = object && object[key];
    		});

    		return object;
    	},
    	isSubPath(path, subPath) {
    		if (Array.isArray(path)) {
    			if (path.length < subPath.length) {
    				return false;
    			}

    			// eslint-disable-next-line unicorn/no-for-loop
    			for (let i = 0; i < subPath.length; i++) {
    				if (path[i] !== subPath[i]) {
    					return false;
    				}
    			}

    			return true;
    		}

    		if (path.length < subPath.length) {
    			return false;
    		}

    		if (path === subPath) {
    			return true;
    		}

    		if (path.startsWith(subPath)) {
    			return path[subPath.length] === PATH_SEPARATOR;
    		}

    		return false;
    	},
    	isRootPath(path) {
    		if (Array.isArray(path)) {
    			return path.length === 0;
    		}

    		return path === '';
    	},
    };

    function isObject(value) {
    	return Object.prototype.toString.call(value) === '[object Object]';
    }

    function isIterator(value) {
    	return value !== null
    		&& typeof value === 'object'
    		&& typeof value.next === 'function';
    }

    /**
    Wraps an iterator's `next()` so yielded values (or [key, value] pairs) are passed through `prepareValue` with the correct owner and path.
    */
    // eslint-disable-next-line max-params
    function wrapIterator(iterator, target, thisArgument, applyPath, prepareValue) {
    	const originalNext = iterator?.next;
    	if (typeof originalNext !== 'function') {
    		return iterator;
    	}

    	if (target.name === 'entries') {
    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result && result.done === false) {
    				result.value[0] = prepareValue(
    					result.value[0],
    					target,
    					result.value[0],
    					applyPath,
    				);
    				result.value[1] = prepareValue(
    					result.value[1],
    					target,
    					result.value[0],
    					applyPath,
    				);
    			}

    			return result;
    		};
    	} else if (target.name === 'values') {
    		const keyIterator = thisArgument[TARGET].keys();

    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result && result.done === false) {
    				result.value = prepareValue(
    					result.value,
    					target,
    					keyIterator.next().value,
    					applyPath,
    				);
    			}

    			return result;
    		};
    	} else {
    		iterator.next = function () {
    			const result = originalNext.call(this);

    			if (result && result.done === false) {
    				result.value = prepareValue(
    					result.value,
    					target,
    					result.value,
    					applyPath,
    				);
    			}

    			return result;
    		};
    	}

    	return iterator;
    }

    function ignoreProperty(cache, options, property) {
    	if (cache.isUnsubscribed) {
    		return true;
    	}

    	if (options.ignoreSymbols && isSymbol(property)) {
    		return true;
    	}

    	// Only strings can be prefixed with "_"
    	if (options.ignoreUnderscores && typeof property === 'string' && property.charAt(0) === '_') {
    		return true;
    	}

    	const keys = options.ignoreKeys;
    	if (keys) {
    		return Array.isArray(keys) ? keys.includes(property) : (keys instanceof Set ? keys.has(property) : false);
    	}

    	return false;
    }

    /**
    @class Cache
    @private
    */
    class Cache {
    	constructor(equals) {
    		this._equals = equals;
    		this._proxyCache = new WeakMap();
    		this._pathCache = new WeakMap();
    		this._allPathsCache = new WeakMap();
    		this.isUnsubscribed = false;
    	}

    	_pathsEqual(pathA, pathB) {
    		if (!Array.isArray(pathA) || !Array.isArray(pathB)) {
    			return pathA === pathB;
    		}

    		return pathA.length === pathB.length
    			&& pathA.every((part, index) => part === pathB[index]);
    	}

    	_getDescriptorCache() {
    		if (this._descriptorCache === undefined) {
    			this._descriptorCache = new WeakMap();
    		}

    		return this._descriptorCache;
    	}

    	_getProperties(target) {
    		const descriptorCache = this._getDescriptorCache();
    		let properties = descriptorCache.get(target);

    		if (properties === undefined) {
    			properties = {};
    			descriptorCache.set(target, properties);
    		}

    		return properties;
    	}

    	_getOwnPropertyDescriptor(target, property) {
    		if (this.isUnsubscribed) {
    			return Reflect.getOwnPropertyDescriptor(target, property);
    		}

    		const properties = this._getProperties(target);
    		let descriptor = properties[property];

    		if (descriptor === undefined) {
    			descriptor = Reflect.getOwnPropertyDescriptor(target, property);
    			properties[property] = descriptor;
    		}

    		return descriptor;
    	}

    	getProxy(target, path, handler, proxyTarget) {
    		if (this.isUnsubscribed) {
    			return target;
    		}

    		const reflectTarget = proxyTarget === undefined ? undefined : target[proxyTarget];
    		const source = reflectTarget ?? target;

    		// Always set the primary path (for backward compatibility)
    		this._pathCache.set(source, path);

    		// Track all paths for this object
    		let allPaths = this._allPathsCache.get(source);
    		if (!allPaths) {
    			allPaths = [];
    			this._allPathsCache.set(source, allPaths);
    		}

    		// Add path if it doesn't already exist
    		const pathExists = allPaths.some(existingPath => this._pathsEqual(existingPath, path));
    		if (!pathExists) {
    			allPaths.push(path);
    		}

    		let proxy = this._proxyCache.get(source);

    		if (proxy === undefined) {
    			proxy = reflectTarget === undefined
    				? new Proxy(target, handler)
    				: target;

    			this._proxyCache.set(source, proxy);
    		}

    		return proxy;
    	}

    	getPath(target) {
    		return this.isUnsubscribed ? undefined : this._pathCache.get(target);
    	}

    	getAllPaths(target) {
    		if (this.isUnsubscribed) {
    			return undefined;
    		}

    		return this._allPathsCache.get(target);
    	}

    	isDetached(target, object) {
    		return !Object.is(target, path.get(object, this.getPath(target)));
    	}

    	defineProperty(target, property, descriptor) {
    		if (!Reflect.defineProperty(target, property, descriptor)) {
    			return false;
    		}

    		if (!this.isUnsubscribed) {
    			this._getProperties(target)[property] = descriptor;
    		}

    		return true;
    	}

    	setProperty(target, property, value, receiver, previous) { // eslint-disable-line max-params
    		if (!this._equals(previous, value) || !(property in target)) {
    			// Check if there's a setter anywhere in the prototype chain
    			let hasSetterInChain = false;
    			let current = target;
    			while (current) {
    				const descriptor = Reflect.getOwnPropertyDescriptor(current, property);

    				if (descriptor && 'set' in descriptor) {
    					hasSetterInChain = true;
    					break;
    				}

    				current = Object.getPrototypeOf(current);
    			}

    			if (hasSetterInChain) {
    				// Use receiver to ensure setter gets proxy as 'this'
    				return Reflect.set(target, property, value, receiver);
    			}

    			// For simple properties, don't use receiver to maintain existing behavior
    			return Reflect.set(target, property, value);
    		}

    		return true;
    	}

    	deleteProperty(target, property, previous) {
    		if (Reflect.deleteProperty(target, property)) {
    			if (!this.isUnsubscribed) {
    				const properties = this._getDescriptorCache().get(target);

    				if (properties) {
    					delete properties[property];
    					this._pathCache.delete(previous);
    				}
    			}

    			return true;
    		}

    		return false;
    	}

    	isSameDescriptor(a, target, property) {
    		const b = this._getOwnPropertyDescriptor(target, property);

    		return a !== undefined
    			&& b !== undefined
    			&& Object.is(a.value, b.value)
    			&& (a.writable || false) === (b.writable || false)
    			&& (a.enumerable || false) === (b.enumerable || false)
    			&& (a.configurable || false) === (b.configurable || false)
    			&& a.get === b.get
    			&& a.set === b.set;
    	}

    	isGetInvariant(target, property) {
    		const descriptor = this._getOwnPropertyDescriptor(target, property);

    		return descriptor !== undefined
    			&& descriptor.configurable !== true
    			&& descriptor.writable !== true;
    	}

    	unsubscribe() {
    		this._descriptorCache = null;
    		this._pathCache = null;
    		this._proxyCache = null;
    		this._allPathsCache = null;
    		this.isUnsubscribed = true;
    	}
    }

    var isArray = Array.isArray;

    function isDiffCertain() {
    	return true;
    }

    function isDiffArrays(clone, value) {
    	if (clone === value) {
    		return false;
    	}

    	return clone.length !== value.length
    		|| clone.some((item, index) => value[index] !== item);
    }

    const IMMUTABLE_OBJECT_METHODS = new Set([
    	'hasOwnProperty',
    	'isPrototypeOf',
    	'propertyIsEnumerable',
    	'toLocaleString',
    	'toString',
    	'valueOf',
    ]);

    const IMMUTABLE_ARRAY_METHODS = new Set([
    	'concat',
    	'includes',
    	'indexOf',
    	'join',
    	'keys',
    	'lastIndexOf',
    ]);

    const MUTABLE_ARRAY_METHODS = {
    	push: isDiffCertain,
    	pop: isDiffCertain,
    	shift: isDiffCertain,
    	unshift: isDiffCertain,
    	copyWithin: isDiffArrays,
    	reverse: isDiffArrays,
    	sort: isDiffArrays,
    	splice: isDiffArrays,
    	flat: isDiffArrays,
    	fill: isDiffArrays,
    };

    const HANDLED_ARRAY_METHODS = new Set([
    	...IMMUTABLE_OBJECT_METHODS,
    	...IMMUTABLE_ARRAY_METHODS,
    	...Object.keys(MUTABLE_ARRAY_METHODS),
    ]);

    function isDiffSets(clone, value) {
    	if (clone === value) {
    		return false;
    	}

    	if (clone.size !== value.size) {
    		return true;
    	}

    	for (const element of clone) {
    		if (!value.has(element)) {
    			return true;
    		}
    	}

    	return false;
    }

    const COLLECTION_ITERATOR_METHODS = [
    	'keys',
    	'values',
    	'entries',
    ];

    const IMMUTABLE_SET_METHODS = new Set([
    	'has',
    	'toString',
    ]);

    const MUTABLE_SET_METHODS = {
    	add: isDiffSets,
    	clear: isDiffSets,
    	delete: isDiffSets,
    	forEach: isDiffSets,
    };

    const HANDLED_SET_METHODS = new Set([
    	...IMMUTABLE_SET_METHODS,
    	...Object.keys(MUTABLE_SET_METHODS),
    	...COLLECTION_ITERATOR_METHODS,
    ]);

    function isDiffMaps(clone, value) {
    	if (clone === value) {
    		return false;
    	}

    	if (clone.size !== value.size) {
    		return true;
    	}

    	for (const [key, aValue] of clone) {
    		const bValue = value.get(key);
    		// Distinguish missing vs undefined and catch strict inequality
    		if (bValue !== aValue || (bValue === undefined && !value.has(key))) {
    			return true;
    		}
    	}

    	return false;
    }

    const IMMUTABLE_MAP_METHODS = new Set([...IMMUTABLE_SET_METHODS, 'get']);

    const MUTABLE_MAP_METHODS = {
    	set: isDiffMaps,
    	clear: isDiffMaps,
    	delete: isDiffMaps,
    	forEach: isDiffMaps,
    };

    const HANDLED_MAP_METHODS = new Set([
    	...IMMUTABLE_MAP_METHODS,
    	...Object.keys(MUTABLE_MAP_METHODS),
    	...COLLECTION_ITERATOR_METHODS,
    ]);

    class CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		this._path = path;
    		this._isChanged = false;
    		this._clonedCache = new Set();
    		this._hasOnValidate = hasOnValidate;
    		this._changes = hasOnValidate ? [] : null;

    		this.clone = path === undefined ? value : this._shallowClone(value);
    	}

    	static isHandledMethod(name) {
    		return IMMUTABLE_OBJECT_METHODS.has(name);
    	}

    	_shallowClone(value) {
    		let clone = value;

    		if (isObject(value)) {
    			clone = {...value};
    		} else if (isArray(value) || ArrayBuffer.isView(value)) {
    			clone = [...value];
    		} else if (value instanceof Date) {
    			clone = new Date(value);
    		} else if (value instanceof Set) {
    			clone = new Set([...value].map(item => this._shallowClone(item)));
    		} else if (value instanceof Map) {
    			clone = new Map();

    			for (const [key, item] of value.entries()) {
    				clone.set(key, this._shallowClone(item));
    			}
    		}

    		this._clonedCache.add(clone);

    		return clone;
    	}

    	preferredThisArg(isHandledMethod, name, thisArgument, thisProxyTarget) {
    		if (isHandledMethod) {
    			if (isArray(thisProxyTarget)) {
    				this._onIsChanged = MUTABLE_ARRAY_METHODS[name];
    			} else if (thisProxyTarget instanceof Set) {
    				this._onIsChanged = MUTABLE_SET_METHODS[name];
    			} else if (thisProxyTarget instanceof Map) {
    				this._onIsChanged = MUTABLE_MAP_METHODS[name];
    			}

    			return thisProxyTarget;
    		}

    		return thisArgument;
    	}

    	update(fullPath, property, value) {
    		const changePath = path.after(fullPath, this._path);

    		if (property !== 'length') {
    			let object = this.clone;

    			path.walk(changePath, key => {
    				if (object?.[key]) {
    					if (!this._clonedCache.has(object[key])) {
    						object[key] = this._shallowClone(object[key]);
    					}

    					object = object[key];
    				}
    			});

    			if (this._hasOnValidate) {
    				this._changes.push({
    					path: changePath,
    					property,
    					previous: value,
    				});
    			}

    			if (object?.[property]) {
    				object[property] = value;
    			}
    		}

    		this._isChanged = true;
    	}

    	undo(object) {
    		let change;

    		for (let index = this._changes.length - 1; index !== -1; index--) {
    			change = this._changes[index];

    			path.get(object, change.path)[change.property] = change.previous;
    		}
    	}

    	isChanged(value, _equals) {
    		return this._onIsChanged === undefined
    			? this._isChanged
    			: this._onIsChanged(this.clone, value);
    	}

    	isPathApplicable(changePath) {
    		return path.isRootPath(this._path) || path.isSubPath(changePath, this._path);
    	}
    }

    class CloneArray extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_ARRAY_METHODS.has(name);
    	}

    	undo(object) {
    		super.undo(object);
    		object.length = this.clone.length;
    	}
    }

    class CloneDate extends CloneObject {
    	undo(object) {
    		object.setTime(this.clone.getTime());
    	}

    	isChanged(value, equals) {
    		return !equals(this.clone.valueOf(), value.valueOf());
    	}
    }

    class CloneSet extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_SET_METHODS.has(name);
    	}

    	undo(object) {
    		for (const value of this.clone) {
    			object.add(value);
    		}

    		for (const value of object) {
    			if (!this.clone.has(value)) {
    				object.delete(value);
    			}
    		}
    	}
    }

    class CloneMap extends CloneObject {
    	static isHandledMethod(name) {
    		return HANDLED_MAP_METHODS.has(name);
    	}

    	undo(object) {
    		for (const [key, value] of this.clone.entries()) {
    			object.set(key, value);
    		}

    		for (const key of object.keys()) {
    			if (!this.clone.has(key)) {
    				object.delete(key);
    			}
    		}
    	}
    }

    class CloneWeakSet extends CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		super(undefined, path, argumentsList, hasOnValidate);

    		this._argument1 = argumentsList[0];
    		this._weakValue = value.has(this._argument1);
    	}

    	isChanged(value, _equals) {
    		return this._weakValue !== value.has(this._argument1);
    	}

    	undo(object) {
    		if (this._weakValue && !object.has(this._argument1)) {
    			object.add(this._argument1);
    		} else {
    			object.delete(this._argument1);
    		}
    	}
    }

    class CloneWeakMap extends CloneObject {
    	constructor(value, path, argumentsList, hasOnValidate) {
    		super(undefined, path, argumentsList, hasOnValidate);

    		this._weakKey = argumentsList[0];
    		this._weakHas = value.has(this._weakKey);
    		this._weakValue = value.get(this._weakKey);
    	}

    	isChanged(value, _equals) {
    		return this._weakValue !== value.get(this._weakKey);
    	}

    	undo(object) {
    		const weakHas = object.has(this._weakKey);

    		if (this._weakHas && !weakHas) {
    			object.set(this._weakKey, this._weakValue);
    		} else if (!this._weakHas && weakHas) {
    			object.delete(this._weakKey);
    		} else if (this._weakValue !== object.get(this._weakKey)) {
    			object.set(this._weakKey, this._weakValue);
    		}
    	}
    }

    function at(arr, i) {
        return arr[i < 0 ? arr.length + i : i];
    }

    class SmartClone {
    	constructor(hasOnValidate) {
    		this._stack = [];
    		this._hasOnValidate = hasOnValidate;
    	}

    	static isHandledType(value) {
    		return isObject(value)
    			|| isArray(value)
    			|| isBuiltinWithMutableMethods(value);
    	}

    	static isHandledMethod(target, name) {
    		if (isObject(target)) {
    			return CloneObject.isHandledMethod(name);
    		}

    		if (isArray(target)) {
    			return CloneArray.isHandledMethod(name);
    		}

    		if (target instanceof Set) {
    			return CloneSet.isHandledMethod(name);
    		}

    		if (target instanceof Map) {
    			return CloneMap.isHandledMethod(name);
    		}

    		return isBuiltinWithMutableMethods(target);
    	}

    	get isCloning() {
    		return this._stack.length > 0;
    	}

    	start(value, path, argumentsList) {
    		let CloneClass = CloneObject;

    		if (isArray(value)) {
    			CloneClass = CloneArray;
    		} else if (value instanceof Date) {
    			CloneClass = CloneDate;
    		} else if (value instanceof Set) {
    			CloneClass = CloneSet;
    		} else if (value instanceof Map) {
    			CloneClass = CloneMap;
    		} else if (value instanceof WeakSet) {
    			CloneClass = CloneWeakSet;
    		} else if (value instanceof WeakMap) {
    			CloneClass = CloneWeakMap;
    		}

    		this._stack.push(new CloneClass(value, path, argumentsList, this._hasOnValidate));
    	}

    	update(fullPath, property, value) {
    		at(this._stack, -1).update(fullPath, property, value);
    	}

    	preferredThisArg(target, thisArgument, thisProxyTarget) {
    		const {name} = target;
    		const isHandledMethod = SmartClone.isHandledMethod(thisProxyTarget, name);

    		return at(this._stack, -1)
    			.preferredThisArg(isHandledMethod, name, thisArgument, thisProxyTarget);
    	}

    	isChanged(value, equals) {
    		return at(this._stack, -1).isChanged(value, equals);
    	}

    	isPartOfClone(changePath) {
    		return at(this._stack, -1).isPathApplicable(changePath);
    	}

    	undo(object) {
    		if (this._previousClone !== undefined) {
    			this._previousClone.undo(object);
    		}
    	}

    	stop() {
    		this._previousClone = this._stack.pop();

    		return this._previousClone.clone;
    	}
    }

    /* eslint-disable unicorn/prefer-spread */

    // Constant set of iterator method names for efficient lookup
    const ITERATOR_METHOD_NAMES = new Set(['values', 'keys', 'entries']);

    // Constant set of array search methods for efficient lookup
    const ARRAY_SEARCH_METHODS = new Set(['indexOf', 'lastIndexOf', 'includes']);

    const defaultOptions = {
    	equals: Object.is,
    	isShallow: false,
    	pathAsArray: false,
    	ignoreSymbols: false,
    	ignoreUnderscores: false,
    	ignoreDetached: false,
    	details: false,
    };

    const shouldProvideApplyData = (details, methodName) => details === false
    	|| details === true
    	|| (Array.isArray(details) && details.includes(methodName));

    const onChange = (object, onChange, options = {}) => {
    	options = {
    		...defaultOptions,
    		...options,
    	};

    	const proxyTarget = Symbol('ProxyTarget');
    	const {equals, isShallow, ignoreDetached, details} = options;
    	const cache = new Cache(equals);
    	const hasOnValidate = typeof options.onValidate === 'function';
    	const smartClone = new SmartClone(hasOnValidate);

    	// eslint-disable-next-line max-params
    	const validate = (target, property, value, previous, applyData) => !hasOnValidate
    		|| smartClone.isCloning
    		|| options.onValidate(path.concat(cache.getPath(target), property), value, previous, applyData) === true;

    	// eslint-disable-next-line max-params
    	const handleChangeOnTarget = (target, property, value, previous, applyData) => {
    		if (
    			ignoreProperty(cache, options, property)
    			|| (ignoreDetached && cache.isDetached(target, object))
    		) {
    			return;
    		}

    		// Determine which paths to notify
    		const allPaths = cache.getAllPaths(target);
    		const pathsToNotify = !smartClone.isCloning && allPaths && allPaths.length > 1
    			? allPaths
    			: [cache.getPath(target)];

    		// Notify all relevant paths
    		for (const changePath of pathsToNotify) {
    			handleChange(changePath, property, value, previous, applyData);
    		}
    	};

    	// eslint-disable-next-line max-params
    	const handleChange = (changePath, property, value, previous, applyData) => {
    		if (smartClone.isCloning && smartClone.isPartOfClone(changePath)) {
    			smartClone.update(changePath, property, previous);
    		} else {
    			onChange(path.concat(changePath, property), value, previous, applyData);
    		}
    	};

    	const getProxyTarget = value =>
    		(value !== null && (typeof value === 'object' || typeof value === 'function'))
    			? (value[proxyTarget] ?? value)
    			: value;

    	const prepareValue = (value, target, property, basePath) => {
    		if (
    			isBuiltinWithoutMutableMethods(value)
    			|| property === 'constructor'
    			|| (isShallow && !SmartClone.isHandledMethod(target, property))
    			|| ignoreProperty(cache, options, property)
    			|| cache.isGetInvariant(target, property)
    			|| (ignoreDetached && cache.isDetached(target, object))
    		) {
    			return value;
    		}

    		if (basePath === undefined) {
    			basePath = cache.getPath(target);
    		}

    		/*
      		Check for circular references.

      		If the value already has a corresponding path/proxy,
    		and if the path corresponds to one of the parents,
    		then we are on a circular case, where the child is pointing to their parent.
    		In this case we return the proxy object with the shortest path.
      		*/
    		const childPath = path.concat(basePath, property);
    		const existingPath = cache.getPath(value);

    		if (existingPath && isSameObjectTree(childPath, existingPath)) {
    			// We are on the same object tree but deeper, so we use the parent path.
    			return cache.getProxy(value, existingPath, handler, proxyTarget);
    		}

    		return cache.getProxy(value, childPath, handler, proxyTarget);
    	};

    	/*
    	Returns true if `childPath` is a subpath of `existingPath`
    	(if childPath starts with existingPath). Otherwise, it returns false.

     	It also returns false if the 2 paths are identical.

     	For example:
    	- childPath    = group.layers.0.parent.layers.0.value
    	- existingPath = group.layers.0.parent
    	*/
    	const isSameObjectTree = (childPath, existingPath) => {
    		if (isSymbol(childPath) || childPath.length <= existingPath.length) {
    			return false;
    		}

    		if (Array.isArray(existingPath) && existingPath.length === 0) {
    			return false;
    		}

    		const childParts = Array.isArray(childPath) ? childPath : childPath.split(PATH_SEPARATOR);
    		const existingParts = Array.isArray(existingPath) ? existingPath : existingPath.split(PATH_SEPARATOR);

    		if (childParts.length <= existingParts.length) {
    			return false;
    		}

    		return !(existingParts.some((part, index) => part !== childParts[index]));
    	};

    	// Unified handler for SmartClone-based method execution
    	const handleMethodExecution = (target, thisArgument, thisProxyTarget, argumentsList) => {
    		// Standard SmartClone path for all handled types including Date
    		let applyPath = path.initial(cache.getPath(target));
    		const isHandledMethod = SmartClone.isHandledMethod(thisProxyTarget, target.name);

    		smartClone.start(thisProxyTarget, applyPath, argumentsList);

    		let result;
    		// Special handling for array search methods that need proxy-aware comparison
    		if (Array.isArray(thisProxyTarget) && ARRAY_SEARCH_METHODS.has(target.name)) {
    			result = performProxyAwareArraySearch({
    				proxyArray: thisProxyTarget,
    				methodName: target.name,
    				searchElement: argumentsList[0],
    				fromIndex: argumentsList[1],
    				getProxyTarget,
    			});
    		} else {
    			result = Reflect.apply(
    				target,
    				smartClone.preferredThisArg(target, thisArgument, thisProxyTarget),
    				isHandledMethod
    					? argumentsList.map(argument => getProxyTarget(argument))
    					: argumentsList,
    			);
    		}

    		const isChanged = smartClone.isChanged(thisProxyTarget, equals);
    		const previous = smartClone.stop();

    		if (SmartClone.isHandledType(result) && isHandledMethod) {
    			if (thisArgument instanceof Map && target.name === 'get') {
    				applyPath = path.concat(applyPath, argumentsList[0]);
    			}

    			result = cache.getProxy(result, applyPath, handler);
    		}

    		if (isChanged) {
    			// Provide applyData based on details configuration
    			const applyData = shouldProvideApplyData(details, target.name)
    				? {
    					name: target.name,
    					args: argumentsList,
    					result,
    				}
    				: undefined;

    			const changePath = smartClone.isCloning
    				? path.initial(applyPath)
    				: applyPath;
    			const property = smartClone.isCloning
    				? path.last(applyPath)
    				: '';

    			if (validate(path.get(object, changePath), property, thisProxyTarget, previous, applyData)) {
    				handleChange(changePath, property, thisProxyTarget, previous, applyData);
    			} else {
    				smartClone.undo(thisProxyTarget);
    			}
    		}

    		if (
    			(thisArgument instanceof Map || thisArgument instanceof Set)
    			&& isIterator(result)
    		) {
    			return wrapIterator(result, target, thisArgument, applyPath, prepareValue);
    		}

    		return result;
    	};

    	const handler = {
    		get(target, property, receiver) {
    			if (isSymbol(property)) {
    				if (property === proxyTarget || property === TARGET) {
    					return target;
    				}

    				if (
    					property === UNSUBSCRIBE
    					&& !cache.isUnsubscribed
    					&& cache.getPath(target).length === 0
    				) {
    					cache.unsubscribe();
    					return target;
    				}
    			}

    			const value = isBuiltinWithMutableMethods(target)
    				? Reflect.get(target, property)
    				: Reflect.get(target, property, receiver);

    			return prepareValue(value, target, property);
    		},

    		set(target, property, value, receiver) {
    			value = getProxyTarget(value);

    			const reflectTarget = target[proxyTarget] ?? target;
    			const previous = reflectTarget[property];

    			if (equals(previous, value) && property in target) {
    				return true;
    			}

    			const isValid = validate(target, property, value, previous);

    			if (
    				isValid
    				&& cache.setProperty(reflectTarget, property, value, receiver, previous)
    			) {
    				handleChangeOnTarget(target, property, target[property], previous);

    				return true;
    			}

    			return !isValid;
    		},

    		defineProperty(target, property, descriptor) {
    			if (!cache.isSameDescriptor(descriptor, target, property)) {
    				const previous = target[property];

    				if (
    					validate(target, property, descriptor.value, previous)
    					&& cache.defineProperty(target, property, descriptor)
    				) {
    					// For accessor descriptors (getters/setters), descriptor.value is undefined
    					// We need to get the actual value after the property is defined
    					const hasValue = Object.hasOwn(descriptor, 'value');
    					const value = hasValue
    						? descriptor.value
    						: (() => {
    							try {
    								// Read the actual value through the getter
    								return target[property];
    							} catch {
    								// If the getter throws, use undefined
    								return undefined;
    							}
    						})();

    					handleChangeOnTarget(target, property, value, previous);
    				}
    			}

    			return true;
    		},

    		deleteProperty(target, property) {
    			if (!Reflect.has(target, property)) {
    				return true;
    			}

    			const previous = Reflect.get(target, property);
    			const isValid = validate(target, property, undefined, previous);

    			if (
    				isValid
    				&& cache.deleteProperty(target, property, previous)
    			) {
    				handleChangeOnTarget(target, property, undefined, previous);

    				return true;
    			}

    			return !isValid;
    		},

    		apply(target, thisArgument, argumentsList) {
    			// Handle case where thisArgument is undefined/null (e.g., extracted method calls)
    			const thisProxyTarget = thisArgument?.[proxyTarget] ?? thisArgument;

    			if (cache.isUnsubscribed) {
    				return Reflect.apply(target, thisProxyTarget, argumentsList);
    			}

    			// Check if SmartClone should be used for aggregate change tracking
    			if (SmartClone.isHandledType(thisProxyTarget)) {
    				// Skip SmartClone for custom methods on plain objects to enable property-level tracking
    				// Note: This approach doesn't support private fields (#field) which require the original instance
    				const isPlainObjectCustomMethod = isObject(thisProxyTarget)
    					&& !SmartClone.isHandledMethod(thisProxyTarget, target.name);

    				if (!isPlainObjectCustomMethod) {
    					// Use SmartClone for internal methods or based on details configuration
    					const isInternalMethod = typeof target.name === 'symbol'
    						|| ITERATOR_METHOD_NAMES.has(target.name);

    					const shouldUseSmartClone = isInternalMethod
    						|| details === false
    						|| (Array.isArray(details) && !details.includes(target.name));

    					if (shouldUseSmartClone) {
    						return handleMethodExecution(target, thisArgument, thisProxyTarget, argumentsList);
    					}
    				}
    			}

    			// Special handling for Date mutations when details option is used
    			// This allows tracking Date method calls with apply data
    			if (thisProxyTarget instanceof Date && SmartClone.isHandledMethod(thisProxyTarget, target.name)) {
    				const previousTime = thisProxyTarget.getTime();
    				const result = Reflect.apply(target, thisProxyTarget, argumentsList);
    				const currentTime = thisProxyTarget.getTime();

    				if (!equals(previousTime, currentTime)) {
    					const applyPath = cache.getPath(thisProxyTarget);

    					if (shouldProvideApplyData(details, target.name)) {
    						const applyData = {
    							name: target.name,
    							args: argumentsList,
    							result,
    						};
    						const previousDate = new Date(previousTime);

    						if (validate(path.get(object, applyPath), '', thisProxyTarget, previousDate, applyData)) {
    							handleChange(applyPath, '', thisProxyTarget, previousDate, applyData);
    						} else {
    							// Undo the change if validation fails
    							thisProxyTarget.setTime(previousTime);
    						}
    					}
    				}

    				return result;
    			}

    			// For plain object custom methods or when SmartClone is not used,
    			// use the proxy as 'this' to ensure property mutations go through proxy traps
    			return Reflect.apply(target, thisArgument, argumentsList);
    		},
    	};

    	const proxy = cache.getProxy(object, options.pathAsArray ? [] : '', handler);
    	onChange = onChange.bind(proxy);

    	if (hasOnValidate) {
    		options.onValidate = options.onValidate.bind(proxy);
    	}

    	return proxy;
    };

    // Helper function for array search methods that need proxy-aware comparison
    const performProxyAwareArraySearch = options => {
    	const {proxyArray, methodName, searchElement, fromIndex, getProxyTarget} = options;
    	const {length} = proxyArray;

    	if (length === 0) {
    		return methodName === 'includes' ? false : -1;
    	}

    	// Parse fromIndex according to ECMAScript specification
    	const isLastIndexOf = methodName === 'lastIndexOf';
    	let startIndex = fromIndex === undefined
    		? (isLastIndexOf ? length - 1 : 0)
    		: Math.trunc(Number(fromIndex)) || 0;

    	if (startIndex < 0) {
    		startIndex = Math.max(0, length + startIndex);
    	} else if (isLastIndexOf) {
    		startIndex = Math.min(startIndex, length - 1);
    	}

    	// Cache the search element's target for efficiency
    	const searchTarget = getProxyTarget(searchElement);

    	// Search with both proxy and target comparison
    	const searchBackward = methodName === 'lastIndexOf';
    	const endIndex = searchBackward ? -1 : length;
    	const step = searchBackward ? -1 : 1;

    	for (let index = startIndex; searchBackward ? index > endIndex : index < endIndex; index += step) {
    		const element = proxyArray[index];
    		if (element === searchElement || getProxyTarget(element) === searchTarget) {
    			return methodName === 'includes' ? true : index;
    		}
    	}

    	return methodName === 'includes' ? false : -1;
    };

    onChange.target = proxy => proxy?.[TARGET] ?? proxy;
    onChange.unsubscribe = proxy => proxy?.[UNSUBSCRIBE] ?? proxy;

    var deepDiff$1 = {exports: {}};

    var deepDiff = deepDiff$1.exports;

    var hasRequiredDeepDiff;

    function requireDeepDiff () {
    	if (hasRequiredDeepDiff) return deepDiff$1.exports;
    	hasRequiredDeepDiff = 1;
    	(function (module, exports) {
    (function(root, factory) { // eslint-disable-line no-extra-semi
    		  var deepDiff = factory(root);
    		  // eslint-disable-next-line no-undef
    		  {
    		      // Node.js
    		      module.exports = deepDiff;
    		  }
    		}(deepDiff, function(root) {
    		  var validKinds = ['N', 'E', 'A', 'D'];

    		  // nodejs compatible on server side and in the browser.
    		  function inherits(ctor, superCtor) {
    		    ctor.super_ = superCtor;
    		    ctor.prototype = Object.create(superCtor.prototype, {
    		      constructor: {
    		        value: ctor,
    		        enumerable: false,
    		        writable: true,
    		        configurable: true
    		      }
    		    });
    		  }

    		  function Diff(kind, path) {
    		    Object.defineProperty(this, 'kind', {
    		      value: kind,
    		      enumerable: true
    		    });
    		    if (path && path.length) {
    		      Object.defineProperty(this, 'path', {
    		        value: path,
    		        enumerable: true
    		      });
    		    }
    		  }

    		  function DiffEdit(path, origin, value) {
    		    DiffEdit.super_.call(this, 'E', path);
    		    Object.defineProperty(this, 'lhs', {
    		      value: origin,
    		      enumerable: true
    		    });
    		    Object.defineProperty(this, 'rhs', {
    		      value: value,
    		      enumerable: true
    		    });
    		  }
    		  inherits(DiffEdit, Diff);

    		  function DiffNew(path, value) {
    		    DiffNew.super_.call(this, 'N', path);
    		    Object.defineProperty(this, 'rhs', {
    		      value: value,
    		      enumerable: true
    		    });
    		  }
    		  inherits(DiffNew, Diff);

    		  function DiffDeleted(path, value) {
    		    DiffDeleted.super_.call(this, 'D', path);
    		    Object.defineProperty(this, 'lhs', {
    		      value: value,
    		      enumerable: true
    		    });
    		  }
    		  inherits(DiffDeleted, Diff);

    		  function DiffArray(path, index, item) {
    		    DiffArray.super_.call(this, 'A', path);
    		    Object.defineProperty(this, 'index', {
    		      value: index,
    		      enumerable: true
    		    });
    		    Object.defineProperty(this, 'item', {
    		      value: item,
    		      enumerable: true
    		    });
    		  }
    		  inherits(DiffArray, Diff);

    		  function arrayRemove(arr, from, to) {
    		    var rest = arr.slice((from) + 1 || arr.length);
    		    arr.length = from < 0 ? arr.length + from : from;
    		    arr.push.apply(arr, rest);
    		    return arr;
    		  }

    		  function realTypeOf(subject) {
    		    var type = typeof subject;
    		    if (type !== 'object') {
    		      return type;
    		    }

    		    if (subject === Math) {
    		      return 'math';
    		    } else if (subject === null) {
    		      return 'null';
    		    } else if (Array.isArray(subject)) {
    		      return 'array';
    		    } else if (Object.prototype.toString.call(subject) === '[object Date]') {
    		      return 'date';
    		    } else if (typeof subject.toString === 'function' && /^\/.*\//.test(subject.toString())) {
    		      return 'regexp';
    		    }
    		    return 'object';
    		  }

    		  // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    		  function hashThisString(string) {
    		    var hash = 0;
    		    if (string.length === 0) { return hash; }
    		    for (var i = 0; i < string.length; i++) {
    		      var char = string.charCodeAt(i);
    		      hash = ((hash << 5) - hash) + char;
    		      hash = hash & hash; // Convert to 32bit integer
    		    }
    		    return hash;
    		  }

    		  // Gets a hash of the given object in an array order-independent fashion
    		  // also object key order independent (easier since they can be alphabetized)
    		  function getOrderIndependentHash(object) {
    		    var accum = 0;
    		    var type = realTypeOf(object);

    		    if (type === 'array') {
    		      object.forEach(function (item) {
    		        // Addition is commutative so this is order indep
    		        accum += getOrderIndependentHash(item);
    		      });

    		      var arrayString = '[type: array, hash: ' + accum + ']';
    		      return accum + hashThisString(arrayString);
    		    }

    		    if (type === 'object') {
    		      for (var key in object) {
    		        if (object.hasOwnProperty(key)) {
    		          var keyValueString = '[ type: object, key: ' + key + ', value hash: ' + getOrderIndependentHash(object[key]) + ']';
    		          accum += hashThisString(keyValueString);
    		        }
    		      }

    		      return accum;
    		    }

    		    // Non object, non array...should be good?
    		    var stringToHash = '[ type: ' + type + ' ; value: ' + object + ']';
    		    return accum + hashThisString(stringToHash);
    		  }

    		  function deepDiff(lhs, rhs, changes, prefilter, path, key, stack, orderIndependent) {
    		    changes = changes || [];
    		    path = path || [];
    		    stack = stack || [];
    		    var currentPath = path.slice(0);
    		    if (typeof key !== 'undefined' && key !== null) {
    		      if (prefilter) {
    		        if (typeof (prefilter) === 'function' && prefilter(currentPath, key)) {
    		          return;
    		        } else if (typeof (prefilter) === 'object') {
    		          if (prefilter.prefilter && prefilter.prefilter(currentPath, key)) {
    		            return;
    		          }
    		          if (prefilter.normalize) {
    		            var alt = prefilter.normalize(currentPath, key, lhs, rhs);
    		            if (alt) {
    		              lhs = alt[0];
    		              rhs = alt[1];
    		            }
    		          }
    		        }
    		      }
    		      currentPath.push(key);
    		    }

    		    // Use string comparison for regexes
    		    if (realTypeOf(lhs) === 'regexp' && realTypeOf(rhs) === 'regexp') {
    		      lhs = lhs.toString();
    		      rhs = rhs.toString();
    		    }

    		    var ltype = typeof lhs;
    		    var rtype = typeof rhs;
    		    var i, j, k, other;

    		    var ldefined = ltype !== 'undefined' ||
    		      (stack && (stack.length > 0) && stack[stack.length - 1].lhs &&
    		        Object.getOwnPropertyDescriptor(stack[stack.length - 1].lhs, key));
    		    var rdefined = rtype !== 'undefined' ||
    		      (stack && (stack.length > 0) && stack[stack.length - 1].rhs &&
    		        Object.getOwnPropertyDescriptor(stack[stack.length - 1].rhs, key));

    		    if (!ldefined && rdefined) {
    		      changes.push(new DiffNew(currentPath, rhs));
    		    } else if (!rdefined && ldefined) {
    		      changes.push(new DiffDeleted(currentPath, lhs));
    		    } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
    		      changes.push(new DiffEdit(currentPath, lhs, rhs));
    		    } else if (realTypeOf(lhs) === 'date' && (lhs - rhs) !== 0) {
    		      changes.push(new DiffEdit(currentPath, lhs, rhs));
    		    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
    		      for (i = stack.length - 1; i > -1; --i) {
    		        if (stack[i].lhs === lhs) {
    		          other = true;
    		          break;
    		        }
    		      }
    		      if (!other) {
    		        stack.push({ lhs: lhs, rhs: rhs });
    		        if (Array.isArray(lhs)) {
    		          // If order doesn't matter, we need to sort our arrays
    		          if (orderIndependent) {
    		            lhs.sort(function (a, b) {
    		              return getOrderIndependentHash(a) - getOrderIndependentHash(b);
    		            });

    		            rhs.sort(function (a, b) {
    		              return getOrderIndependentHash(a) - getOrderIndependentHash(b);
    		            });
    		          }
    		          i = rhs.length - 1;
    		          j = lhs.length - 1;
    		          while (i > j) {
    		            changes.push(new DiffArray(currentPath, i, new DiffNew(undefined, rhs[i--])));
    		          }
    		          while (j > i) {
    		            changes.push(new DiffArray(currentPath, j, new DiffDeleted(undefined, lhs[j--])));
    		          }
    		          for (; i >= 0; --i) {
    		            deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack, orderIndependent);
    		          }
    		        } else {
    		          var akeys = Object.keys(lhs);
    		          var pkeys = Object.keys(rhs);
    		          for (i = 0; i < akeys.length; ++i) {
    		            k = akeys[i];
    		            other = pkeys.indexOf(k);
    		            if (other >= 0) {
    		              deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
    		              pkeys[other] = null;
    		            } else {
    		              deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack, orderIndependent);
    		            }
    		          }
    		          for (i = 0; i < pkeys.length; ++i) {
    		            k = pkeys[i];
    		            if (k) {
    		              deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack, orderIndependent);
    		            }
    		          }
    		        }
    		        stack.length = stack.length - 1;
    		      } else if (lhs !== rhs) {
    		        // lhs is contains a cycle at this element and it differs from rhs
    		        changes.push(new DiffEdit(currentPath, lhs, rhs));
    		      }
    		    } else if (lhs !== rhs) {
    		      if (!(ltype === 'number' && isNaN(lhs) && isNaN(rhs))) {
    		        changes.push(new DiffEdit(currentPath, lhs, rhs));
    		      }
    		    }
    		  }

    		  function observableDiff(lhs, rhs, observer, prefilter, orderIndependent) {
    		    var changes = [];
    		    deepDiff(lhs, rhs, changes, prefilter, null, null, null, orderIndependent);
    		    if (observer) {
    		      for (var i = 0; i < changes.length; ++i) {
    		        observer(changes[i]);
    		      }
    		    }
    		    return changes;
    		  }

    		  function orderIndependentDeepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
    		    return deepDiff(lhs, rhs, changes, prefilter, path, key, stack, true);
    		  }

    		  function accumulateDiff(lhs, rhs, prefilter, accum) {
    		    var observer = (accum) ?
    		      function (difference) {
    		        if (difference) {
    		          accum.push(difference);
    		        }
    		      } : undefined;
    		    var changes = observableDiff(lhs, rhs, observer, prefilter);
    		    return (accum) ? accum : (changes.length) ? changes : undefined;
    		  }

    		  function accumulateOrderIndependentDiff(lhs, rhs, prefilter, accum) {
    		    var observer = (accum) ?
    		      function (difference) {
    		        if (difference) {
    		          accum.push(difference);
    		        }
    		      } : undefined;
    		    var changes = observableDiff(lhs, rhs, observer, prefilter, true);
    		    return (accum) ? accum : (changes.length) ? changes : undefined;
    		  }

    		  function applyArrayChange(arr, index, change) {
    		    if (change.path && change.path.length) {
    		      var it = arr[index],
    		        i, u = change.path.length - 1;
    		      for (i = 0; i < u; i++) {
    		        it = it[change.path[i]];
    		      }
    		      switch (change.kind) {
    		        case 'A':
    		          applyArrayChange(it[change.path[i]], change.index, change.item);
    		          break;
    		        case 'D':
    		          delete it[change.path[i]];
    		          break;
    		        case 'E':
    		        case 'N':
    		          it[change.path[i]] = change.rhs;
    		          break;
    		      }
    		    } else {
    		      switch (change.kind) {
    		        case 'A':
    		          applyArrayChange(arr[index], change.index, change.item);
    		          break;
    		        case 'D':
    		          arr = arrayRemove(arr, index);
    		          break;
    		        case 'E':
    		        case 'N':
    		          arr[index] = change.rhs;
    		          break;
    		      }
    		    }
    		    return arr;
    		  }

    		  function applyChange(target, source, change) {
    		    if (typeof change === 'undefined' && source && ~validKinds.indexOf(source.kind)) {
    		      change = source;
    		    }
    		    if (target && change && change.kind) {
    		      var it = target,
    		        i = -1,
    		        last = change.path ? change.path.length - 1 : 0;
    		      while (++i < last) {
    		        if (typeof it[change.path[i]] === 'undefined') {
    		          it[change.path[i]] = (typeof change.path[i + 1] !== 'undefined' && typeof change.path[i + 1] === 'number') ? [] : {};
    		        }
    		        it = it[change.path[i]];
    		      }
    		      switch (change.kind) {
    		        case 'A':
    		          if (change.path && typeof it[change.path[i]] === 'undefined') {
    		            it[change.path[i]] = [];
    		          }
    		          applyArrayChange(change.path ? it[change.path[i]] : it, change.index, change.item);
    		          break;
    		        case 'D':
    		          delete it[change.path[i]];
    		          break;
    		        case 'E':
    		        case 'N':
    		          it[change.path[i]] = change.rhs;
    		          break;
    		      }
    		    }
    		  }

    		  function revertArrayChange(arr, index, change) {
    		    if (change.path && change.path.length) {
    		      // the structure of the object at the index has changed...
    		      var it = arr[index],
    		        i, u = change.path.length - 1;
    		      for (i = 0; i < u; i++) {
    		        it = it[change.path[i]];
    		      }
    		      switch (change.kind) {
    		        case 'A':
    		          revertArrayChange(it[change.path[i]], change.index, change.item);
    		          break;
    		        case 'D':
    		          it[change.path[i]] = change.lhs;
    		          break;
    		        case 'E':
    		          it[change.path[i]] = change.lhs;
    		          break;
    		        case 'N':
    		          delete it[change.path[i]];
    		          break;
    		      }
    		    } else {
    		      // the array item is different...
    		      switch (change.kind) {
    		        case 'A':
    		          revertArrayChange(arr[index], change.index, change.item);
    		          break;
    		        case 'D':
    		          arr[index] = change.lhs;
    		          break;
    		        case 'E':
    		          arr[index] = change.lhs;
    		          break;
    		        case 'N':
    		          arr = arrayRemove(arr, index);
    		          break;
    		      }
    		    }
    		    return arr;
    		  }

    		  function revertChange(target, source, change) {
    		    if (target && source && change && change.kind) {
    		      var it = target,
    		        i, u;
    		      u = change.path.length - 1;
    		      for (i = 0; i < u; i++) {
    		        if (typeof it[change.path[i]] === 'undefined') {
    		          it[change.path[i]] = {};
    		        }
    		        it = it[change.path[i]];
    		      }
    		      switch (change.kind) {
    		        case 'A':
    		          // Array was modified...
    		          // it will be an array...
    		          revertArrayChange(it[change.path[i]], change.index, change.item);
    		          break;
    		        case 'D':
    		          // Item was deleted...
    		          it[change.path[i]] = change.lhs;
    		          break;
    		        case 'E':
    		          // Item was edited...
    		          it[change.path[i]] = change.lhs;
    		          break;
    		        case 'N':
    		          // Item is new...
    		          delete it[change.path[i]];
    		          break;
    		      }
    		    }
    		  }

    		  function applyDiff(target, source, filter) {
    		    if (target && source) {
    		      var onChange = function (change) {
    		        if (!filter || filter(target, source, change)) {
    		          applyChange(target, source, change);
    		        }
    		      };
    		      observableDiff(target, source, onChange);
    		    }
    		  }

    		  Object.defineProperties(accumulateDiff, {

    		    diff: {
    		      value: accumulateDiff,
    		      enumerable: true
    		    },
    		    orderIndependentDiff: {
    		      value: accumulateOrderIndependentDiff,
    		      enumerable: true
    		    },
    		    observableDiff: {
    		      value: observableDiff,
    		      enumerable: true
    		    },
    		    orderIndependentObservableDiff: {
    		      value: orderIndependentDeepDiff,
    		      enumerable: true
    		    },
    		    orderIndepHash: {
    		      value: getOrderIndependentHash,
    		      enumerable: true
    		    },
    		    applyDiff: {
    		      value: applyDiff,
    		      enumerable: true
    		    },
    		    applyChange: {
    		      value: applyChange,
    		      enumerable: true
    		    },
    		    revertChange: {
    		      value: revertChange,
    		      enumerable: true
    		    },
    		    isConflict: {
    		      value: function () {
    		        return typeof $conflict !== 'undefined';
    		      },
    		      enumerable: true
    		    }
    		  });

    		  // hackish...
    		  accumulateDiff.DeepDiff = accumulateDiff;
    		  // ...but works with:
    		  // import DeepDiff from 'deep-diff'
    		  // import { DeepDiff } from 'deep-diff'
    		  // const DeepDiff = require('deep-diff');
    		  // const { DeepDiff } = require('deep-diff');

    		  root.DeepDiff = accumulateDiff;
    		  return accumulateDiff;
    		})); 
    	} (deepDiff$1));
    	return deepDiff$1.exports;
    }

    var deepDiffExports = requireDeepDiff();
    var diff = /*@__PURE__*/getDefaultExportFromCjs(deepDiffExports);

    class EventAttrBase {
        constructor(mapId, eventId) {
            this.mapId = mapId;
            this.id = eventId;
        }
        get map() {
            return TrueWay.getMapById(this.mapId);
        }
        findEvent(x, y) {
            const dataMapAll = TrueWay.$dataMapAll;
            const events = dataMapAll[this.mapId].events;
            const [selfX, selfY] = [events[this.id].x, events[this.id].y];
            const target = events.find((v, _i, _o) => {
                if (!v)
                    return false;
                return (v.x === (selfX + x)) && (v.y === (selfY + y));
            });
            if (target === undefined)
                throw new TrueWayError(`Map ${this.mapId} event ${this.id} can not find (${x}, ${y})`);
            return getEventByMapIdAndEventId(this.mapId, target.id);
        }
        static hasSetter(propName) {
            const descriptor = Object.getOwnPropertyDescriptor(this.prototype, propName);
            return descriptor && typeof descriptor.set === 'function';
        }
        static initProperties() {
            for (const name of ['A', 'B', 'C', 'D']) {
                Object.defineProperty(EventAttrBase.prototype, name.toLowerCase(), {
                    get: function () {
                        return mz.$gameSelfSwitches.value([this.mapId, this.id, name]);
                    },
                    set: function (v) {
                        if (typeof v !== 'boolean') {
                            throw new TrueWayError(`Can not set map ${this.mapId} event ${this.id} switch ${name} to non-boolean`);
                        }
                        mz.$gameSelfSwitches.setValue([this.mapId, this.id, name], v);
                    }
                });
            }
        }
    }
    EventAttrBase.initProperties();
    TrueWay.EventAttrBase = EventAttrBase;
    function getEventByMapIdAndEventId(mapId, eventId) {
        if (TrueWay._data?.[mapId]?.[eventId] === undefined) {
            throw new TrueWayError(`Map ${mapId} event ${eventId} dose not exist`);
        }
        // @ts-expect-error
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
                if (EventAttrBase.hasSetter(p)) {
                    return Reflect.set(target, p, newValue);
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
    exports.dynamicEvents = void 0;
    if (param.eventMonitor) {
        const _Game_Map_setup = mz.Game_Map.prototype.setup;
        mz.Game_Map.prototype.setup = function (mapId) {
            _Game_Map_setup.call(this, mapId);
            TrueWay._currentTrueEvents = mz.$gameMap._events;
            exports.dynamicEvents = [];
            mz.$gameMap._events = onChange(TrueWay._currentTrueEvents, (path, value, previous, applyData) => {
                if (path !== '')
                    return;
                const difference = diff(previous, value);
                if (difference === undefined)
                    return;
                for (const i of difference) {
                    if (i.kind === 'N') {
                        exports.dynamicEvents.push(i.rhs);
                        console.log(exports.dynamicEvents);
                    }
                }
            });
        };
    }

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
        static hasSetter(propName) {
            const descriptor = Object.getOwnPropertyDescriptor(this.prototype, propName);
            return descriptor && typeof descriptor.set === 'function';
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
                if (MapAttrBase.hasSetter(p)) {
                    return Reflect.set(target, p, newValue);
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

    const error = (v) => new TrueWayError(`Duplicated global variable or switch name ${v}. Modify name or disable the key feature to pass`);
    function createTable() {
        const table = {};
        for (const i in mz.$dataSystem.variables) {
            const v = mz.$dataSystem.variables[i];
            if (!v)
                continue;
            if (v in table) {
                throw error(v);
            }
            table[v] = { type: 0 /* IdType.VAR */, value: Number(i) };
        }
        for (const i in mz.$dataSystem.switches) {
            const v = mz.$dataSystem.switches[i];
            if (!v)
                continue;
            if (v in table) {
                throw error(v);
            }
            table[v] = { type: 1 /* IdType.SWITCH */, value: Number(i) };
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
                const id = table[p];
                if (id === undefined) {
                    throw new TrueWayError(`Getting unknown global variable or switch name ${p}`);
                }
                switch (id.type) {
                    case 1 /* IdType.SWITCH */:
                        return mz.$gameSwitches.value(id.value);
                    case 0 /* IdType.VAR */:
                        return mz.$gameVariables.value(id.value);
                }
            },
            set: function (target, p, newValue) {
                if (newValue === undefined) {
                    throw new TrueWayError(`Can not set global ${p} to undefined`);
                }
                const id = table[p];
                if (id === undefined) {
                    throw new TrueWayError(`Setting unknown global variable or switch name ${p}`);
                }
                switch (id.type) {
                    case 1 /* IdType.SWITCH */:
                        if (typeof newValue !== 'boolean') {
                            throw new TrueWayError(`Can not set global switch ${p} to non-boolean ${newValue}`);
                        }
                        mz.$gameSwitches.setValue(id.value, newValue);
                        break;
                    case 0 /* IdType.VAR */:
                        mz.$gameVariables.setValue(id.value, newValue);
                        break;
                }
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

    exports.EventAttrBase = EventAttrBase;
    exports.MapAttrBase = MapAttrBase;
    exports.TrueWayError = TrueWayError;
    exports.genReg = genReg;
    exports.getEventByMapIdAndEventId = getEventByMapIdAndEventId;
    exports.param = param;

    return exports;

})({}, window);
