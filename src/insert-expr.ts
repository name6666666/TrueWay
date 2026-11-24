import mz from 'rmmz'
import { param } from './true-way'
import escape from 'escape-string-regexp'


const pattern = new RegExp(String.raw`\x1b${escape(param.js)}\[([\S\s]*)\]`, 'g')

const _Window_Base_convertEscapeCharacters = mz.Window_Base.prototype.convertEscapeCharacters
mz.Window_Base.prototype.convertEscapeCharacters = function(text) {
    text = _Window_Base_convertEscapeCharacters.call(this, text)
    const newText = text.replace(pattern, (match, g1) => {
        return String(window.eval(g1))
    })
    return newText
}
