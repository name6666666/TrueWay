import mz from 'rmmz'
import { param, TrueWayError } from './true-way'


const enum IdType {
    VAR, SWITCH
}
type Id = {type: IdType, value: number}

const error = (v: string) => 
    new TrueWayError(`Duplicated global variable or switch name ${v}. Modify name or disable the key feature to pass`)

function createTable() {
    const table: Record<string, Id> = {}
    for (const i in mz.$dataSystem.variables) {
        const v = mz.$dataSystem.variables[i]
        if (!v) continue
        if (v in table) {
            throw error(v)
        }
        table[v] = {type: IdType.VAR, value: Number(i)}
    }
    for (const i in mz.$dataSystem.switches) {
        const v = mz.$dataSystem.switches[i]
        if (!v) continue
        if (v in table) {
            throw error(v)
        }
        table[v] = {type: IdType.SWITCH, value: Number(i)}
    }
    return table
}

let table: Record<string, Id>

const _createGameObjects = mz.DataManager.createGameObjects
mz.DataManager.createGameObjects = function() {
    _createGameObjects.call(this)
    table = createTable()
}

if (param.global !== null) {
    // @ts-ignore
    window[param.global] = new Proxy({}, {
        get: function(target, p, receiver) {
            const id = table[p as string]
            if (id === undefined) {
                throw new TrueWayError(`Getting unknown global variable or switch name ${p as string}`)
            }
            switch (id.type) {
                case IdType.SWITCH:
                    return mz.$gameSwitches.value(id.value)
                case IdType.VAR:
                    return mz.$gameVariables.value(id.value)
            }
        },
        set: function(target, p, newValue) {
            if (newValue === undefined) {
                throw new TrueWayError(`Can not set global ${p as string} to undefined`)
            }
            const id = table[p as string]
            if (id === undefined) {
                throw new TrueWayError(`Setting unknown global variable or switch name ${p as string}`)
            }
            switch (id.type) {
                case IdType.SWITCH:
                    if (typeof newValue !== 'boolean') {
                        throw new TrueWayError(`Can not set global switch ${p as string} to non-boolean ${newValue}`)
                    }
                    mz.$gameSwitches.setValue(id.value, newValue)
                case IdType.VAR:
                    mz.$gameVariables.setValue(id.value, newValue)
            }
            return true
        }
    })
}
