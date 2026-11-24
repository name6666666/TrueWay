import mz from 'rmmz'
import { param, TrueWayError } from './true-way'


if (param.global !== null) {
    const table: {[name: string]: number} = {}
    for (const i in mz.$dataSystem.variables) {
        const v = mz.$dataSystem.variables[i]
        if (!v) continue
        if (v in table) {
            throw new TrueWayError(`Duplicated global variable name ${v}. Modify name or disable the key feature to pass`)
        }
        table[v] = Number(i)
    }

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
