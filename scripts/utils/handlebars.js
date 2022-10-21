import MODULE_ID from './module.js'
import { camelCase } from './string.js'

/**
 * @param {string} name
 * @param {Handlebars.HelperDelegate} fn
 */
export function registerHelper(name, fn) {
    if (Handlebars.helpers[name]) return
    Handlebars.registerHelper(name, fn)
}

export function registerLocalize() {
    const name = camelCase(MODULE_ID)
    registerHelper(name, function (key, options) {
        key = `${MODULE_ID}.templates.${key}`
        const data = options.hash
        return isEmpty(data) ? game.i18n.localize(key) : game.i18n.format(key, data)
    })
}
