import mz from 'rmmz'
import { param, TrueWayError } from './true-way'


type Table = {[name: string]: number}

function createTable() {
    const table: Table = {}
    for (const i in mz.$dataSystem.variables) {
        const v = mz.$dataSystem.variables[i]
        if (!v) continue
        if (v in table) {
            throw new TrueWayError(`Duplicated global variable name ${v}. Modify name or disable the key feature to pass`)
        }
        table[v] = Number(i)
    }
    return table
}

let table: Table

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    table = createTable()
}

if (param.global !== null) {
    // @ts-ignore
    window[param.global] = new Proxy({}, {
        get: function(target, p, receiver) {
            return mz.$gameVariables.value(table[p as string])
        },
        set: function(target, p, newValue) {
            mz.$gameVariables.setValue(table[p as string], newValue)
            return true
        }
    })
}
