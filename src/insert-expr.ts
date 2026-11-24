import mz from 'rmmz'
import { param, TrueWayError } from './true-way'
import jsTokens from 'js-tokens'


const begin = `\x1b${param.js}“`
const end = '。'

function solveText(text: string): [string, string] {
    const noMark = text.substring(begin.length)
    const tokens = jsTokens(noMark)
    let script = ''
    for (const token of tokens) {
        if (token.type === 'Invalid') {
            console.log(`type: ${token.value}`)
            if (token.value === end) {
                console.log(`script: ${script}`)
                return [window.eval(script), noMark.substring(script.length + end.length)]
            } else {
                script += token.value
            }
        } else {
            script += token.value
        }
    }
    throw new TrueWayError('6767')
}

function computeInsert(text: string) {
    let newText = ''
    for (;;) {
        const i = text.indexOf(begin)
        if (i === -1) {
            newText += text
            break
        }
        newText += text.substring(0, i)
        const [result, remain] = solveText(text.substring(i))
        text = remain
        newText += result
        if (!text) break
    }
    return newText
}

console.log(computeInsert(`
rg 4et9 6767 测试 // ee"“”ffw
得到\x1bjs“"1" + "“aa。"。\x1bjs“666。
`))

const _Window_Base_convertEscapeCharacters = mz.Window_Base.prototype.convertEscapeCharacters
mz.Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text)
    return computeInsert(text)
}
