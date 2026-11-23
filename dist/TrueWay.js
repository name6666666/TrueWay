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
 * @desc 进入地图时，在所有事件开始判定之间就执行的脚本的标签，为空禁用
 * @type text
 * @default onEnter
 * 
 * @param initMap
 * @text 初始化地图脚本标签
 * @desc 在游戏启动时为每个地图初始化属性的脚本的标签，为空报错
 * @type text
 * @default init
 * 
 * @command initEvent
 * @text 初始化事件脚本
 * @desc 编写在游戏启动时为事件初始化属性的脚本，不受事件系统约束，一定会在游戏刚启动时执行
 * @arg script
 * @text 脚本
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
(function (mz) {
    'use strict';

    class TrueWayError extends Error {
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
        param.map, param.self, param.onEnter, param.initMap
    ]) {
        const match = ident.match(identifierRegex);
        if (match === null) {
            throw new TrueWayError(`Invailid identifier ${ident}`);
        }
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

    const _createGameObjects$2 = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects$2.call(this);
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
                throw new TrueWayError(`Duplicated map name ${node.name}. Modify name or disable the key feature to pass`);
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
                    throw new TrueWayError(`Duplicated event name ${e.name}. Modify name or disable the key feature to pass`);
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

    function getEventByMapIdAndEventId(mapId, eventId) {
        // @ts-ignore
        return new Proxy({}, {
            get: function (target, p, receiver) {
                const ret = Reflect.get(TrueWay._data[mapId][eventId], p);
                if (ret === undefined) {
                    switch (p) {
                        case 'map': TrueWay.getMapById(mapId);
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
        console.log(cmd);
    }
    const _createGameObjects$1 = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects$1.call(this);
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

    let mapTable;
    let inverseMapTable;
    let eventTable;
    const _createGameObjects = mz.DataManager.createGameObjects;
    mz.DataManager.createGameObjects = function () {
        _createGameObjects.call(this);
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
    function parent(id) {
        const newId = mz.$dataMapInfos[id].parentId;
        if (newId === 0)
            throw new TrueWayError(`Map ${id} has no parent`);
        return TrueWay.getMapById(newId);
    }
    // @ts-ignore
    TrueWay.getMapById = function (id) {
        if (!(id in TrueWay._data))
            throw new TrueWayError(`Unknown map id ${id}`);
        return new Proxy({}, {
            get: function (target, p, receiver) {
                const ret = Reflect.get(TrueWay._data[id].mapVars, p);
                if (ret === undefined) {
                    switch (p) {
                        case 'id': return id;
                        case 'parent': return parent(id);
                        case 'entered': return false;
                        case 'getEventById': return function (eventId) {
                            return getEventByMapIdAndEventId(id, eventId);
                        };
                        case 'getMapByName': return function (name) {
                            if (inverseMapTable === null || mapTable === null) {
                                throw new TrueWayError(`${TrueWay.getMapByName.name} unavailable. Particular configuration required`);
                            }
                            const path = [...inverseMapTable[id], name];
                            let target = mapTable[path[0]];
                            for (const i in path) {
                                if (i === '0')
                                    continue;
                                const part = path[i];
                                target = target.children[part];
                            }
                            if (!(id in TrueWay._data))
                                throw new TrueWayError(`Unknown map name ${name}`);
                            return TrueWay.getMapById(target.id);
                        };
                        case 'getEventByName': return function (name) {
                            if (eventTable === null) {
                                throw new TrueWayError(`getEventByName unavailable. Particular configuration required`);
                            }
                            const events = eventTable[id];
                            const eventId = events[name];
                            return getEventByMapIdAndEventId(id, eventId);
                        };
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
    TrueWay.getMapByName = function (name) {
        if (mapTable === null)
            throw new TrueWayError(`${TrueWay.getMapByName.name} unavailable. Particular configuration required`);
        if (!(name in mapTable))
            throw new TrueWayError(`Map ${name} is not a top map. Can not use ${TrueWay.getMapByName.name}`);
        return TrueWay.getMapById(mapTable[name].id);
    };
    TrueWay.getMapCurrent = function () {
        return TrueWay.getMapById(mz.$gameMap.mapId());
    };
    let onEnterPattern;
    if (param.onEnter) {
        const label = escapeStringRegexp(String(param.onEnter));
        onEnterPattern = genReg(label);
    }
    const _Game_Map_setup = mz.Game_Map.prototype.setup;
    mz.Game_Map.prototype.setup = function (mapId) {
        _Game_Map_setup.call(this, mapId);
        const map = TrueWay.getMapCurrent();
        if (param.map) {
            // @ts-ignore
            window[param.map] = map;
        }
        if (param.onEnter) {
            const matches = mz.$dataMap.note.matchAll(onEnterPattern);
            for (const match of matches) {
                const script = match[1];
                const func = new Function(script);
                func();
            }
        }
        map.entered = true;
    };

})(window);
