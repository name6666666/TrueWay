import mz from 'rmmz'
import { param, TrueWayError } from './true-way'
import jsTokens from 'js-tokens'


const begin = `\x1b${param.js}[`
const end = ']'

function mzToNormal(text: string): string {
    return text.replace(/\x1b/g, '\\').replace(/\\/g, '\\\\')
}

function solveText(text: string): [string, string] {
    const noMark = text.substring(begin.length)
    const tokens = jsTokens(noMark)
    let script = ''
    let depth = 1
    for (const token of tokens) {
        if (token.type === 'Punctuator') {
            if (token.value === end) {
                depth--
                if (depth === 0) return [String(window.eval(script)), noMark.substring(script.length + end.length)]
                else script += token.value
            } else {
                if (token.value === '[') depth++
                script += token.value
            }
        } else {
            script += mzToNormal(token.value)
        }
    }
    throw new TrueWayError(`Boarderless inserted expression:\n ${mzToNormal(text)}`)
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

const _Window_Base_convertEscapeCharacters = mz.Window_Base.prototype.convertEscapeCharacters
mz.Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text)
    return computeInsert(text)
}
