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
 * @url 6767
 * 
 * @param map
 * @text 全局变量map
 * @desc map总是当前地图的属性管理器
 * @type boolean
 * @default true
 * @on yes
 * @off no
 * 
 * @param self
 * @text 全局变量self
 * @desc self总是当前事件的属性管理器
 * @type boolean
 * @default true
 * @on yes
 * @off no
 * 
 * @param init
 * @text 初始化标签
 * @desc 设置初始化标签的名称
 * @type text
 * @default init
 */