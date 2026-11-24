import mz from 'rmmz'
import { param, TrueWayError } from './true-way'
import jsTokens, { Token } from 'js-tokens'

const begin = param.js.parentheses[0]
const mark = `\x1b${param.js.label}${begin}`
const end = param.js.parentheses[1]

function mzToNormal(text: string): string {
    return text.replace(mzToNormal.pattern, (match, g1) => {
        switch (g1) {
            case '\x1b': return '\\'
            case '\\': return '\\\\'
            default: throw new TrueWayError('Unreachable. It is inner error')
        }
    })
}
mzToNormal.pattern = /(\x1b|\\)/g

function normalToMz(text: string): string {
    return text.replace(normalToMz.p1, "\x1b").replace(normalToMz.p2, "\\")
}
normalToMz.p1 = /\\/g
normalToMz.p2 = /\x1b\x1b/g

function solveText(text: string): [string, string] {
    const noMark = text.substring(mark.length)
    const tokens = jsTokens(mzToNormal(noMark))
    const tokenArr: Token[] = []
    for (const token of tokens) tokenArr.push(token)
    let script = ''
    let depth = 1
    for (const i in tokenArr) {
        const token = tokenArr[i]
        if (token.type === 'Punctuator') {
            if (token.value === end) {
                depth--
                if (depth === 0) {
                    let remain = ''
                    for (let j = Number(i) + 1; j < tokenArr.length; j++) {
                        remain += tokenArr[j].value
                    }
                    return [String(window.eval(script)), normalToMz(remain)]
                }
                else script += token.value
            } else {
                if (token.value === begin) depth++
                script += token.value
            }
        } else {
            script += token.value
        }
    }
    throw new TrueWayError(`Boarderless inserted expression:\n ${mzToNormal(text)}`)
}

function computeInsert(text: string) {
    let newText = ''
    for (;;) {
        const i = text.indexOf(mark)
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
