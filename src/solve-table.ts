import mz from 'rmmz'
import { InverseMapTable, MapTable } from './map-attr'


export function solveMapTable(): [MapTable, InverseMapTable] {
    interface Node {
        parent: Node | null
        name: string
        id: number
        children: Node[]
    }
    const temporaryTable: {[id:string]:Node} = {}
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
}