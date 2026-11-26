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
