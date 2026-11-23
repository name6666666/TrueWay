import mz from 'rmmz'
import { EventTable, InverseMapTable, MapTable } from './map-attr'
import { TrueWayError } from './true-way'


interface Node {
    parent: Node | null
    name: string
    id: number
    children: Node[]
}

type NodeTable = Record<number, Node>

export function solveMapTable(): [MapTable, InverseMapTable] {
    const temporaryTable: NodeTable = {}
    function addNode(info: mz.DataMapInfo): Node {
        if (info.id in temporaryTable) return temporaryTable[info.id]
        if (info.parentId === 0) {
            const ret = {
                name: info.name,
                id: info.id,
                parent: null,
                children: []
            }
            temporaryTable[ret.id] = ret
            return ret
        }
        const parent = addNode(mz.$dataMapInfos[info.parentId])
        temporaryTable[parent.id] = parent
        const ret = {
            name: info.name,
            id: info.id,
            parent,
            children: []
        }
        parent.children.push(ret)
        temporaryTable[ret.id] = ret
        return ret
    }
    for (const info of mz.$dataMapInfos) {
        if (!info) continue
        addNode(info)
    }

    const mapTable: MapTable = {}
    const root: Node[] = []
    for (const id in temporaryTable) {
        const node = temporaryTable[id]
        if (node.parent === null) root.push(node)
    }
    function addMapTable(table: MapTable, node: Node) {
        const children: MapTable = {}
        for (const child of node.children) {
            addMapTable(children, child)
        }
        if (node.name in table) {
            throw new TrueWayError(`Duplicated map name ${node.name}. Modify name or disable the key feature to pass`)
        }
        table[node.name] = {
            id: node.id,
            children
        }
    }
    for (const n of root) {
        addMapTable(mapTable, n)
    }

    const inverseMapTable: InverseMapTable = {}
    function addInverseMapTable(table: MapTable, path: string[]) {
        for (const name in table) {
            const map = table[name]
            const newPath = [...path, name]
            inverseMapTable[map.id] = newPath
            addInverseMapTable(map.children, newPath)
        }
    }
    addInverseMapTable(mapTable, [])

    return [mapTable, inverseMapTable]
}

export function solveEventTable(): EventTable {
    const dataMapAll = TrueWay.$dataMapAll!
    const ret: EventTable = {}
    for (const i in dataMapAll) {
        const map = dataMapAll[i]
        const events: {[name: string]: number} = {}
        for (const e of map.events) {
            if (e.name in events) {
                throw new TrueWayError(`Duplicated event name ${e.name}. Modify name or disable the key feature to pass`)
            }
            events[e.name] = e.id
        }
        ret[i] = events
    }
    return ret
}
