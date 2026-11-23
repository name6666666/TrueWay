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