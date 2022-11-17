import MODULE_ID from './module.js'

/** @param {...string} path */
export function templatePath(...path) {
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

/** @param {foundry.Document} document */
export function hasModuleFlag(document) {
    return !!document.flags && MODULE_ID in document.flags
}

/**
 * @param {foundry.Document} document
 * @param {string} key
 * @param {string[]} keys
 */
export function getFlag(document, key, ...keys) {
    keys.unshift(key)
    return document.getFlag(MODULE_ID, keys.join('.'))
}

/**
 * @template {foundry.Document} T
 * @param {T} document
 * @param {string} key
 * @param {any} value
 * @returns T
 */
export function setFlag(document, key, value) {
    return document.setFlag(MODULE_ID, key, value)
}

/** @param {string[]} path */
function getSettingLocalizationPath(...path) {
    return `${MODULE_ID}.settings.${path.join('.')}`
}

/**
 * @template {*} T
 * @param {Omit<RequiredBy<SettingConfig<T>, 'name'>, 'key' | 'namespace'>} options
 * options.scope = 'world'
 *
 * options.config = false
 */
export function registerSetting(options) {
    const name = options.name
    options.scope = options.scope ?? 'world'
    options.config = options.config ?? false
    if (options.config) {
        options.name = getSettingLocalizationPath(name, 'name')
        options.hint = getSettingLocalizationPath(name, 'hint')
    }
    game.settings.register(MODULE_ID, name, options)
}

/**
 * @param {string} key
 * @param {object} [data]
 */
export function localize(key, data) {
    key = `${MODULE_ID}.${key}`
    if (data) return game.i18n.format(key, data)
    return game.i18n.localize(key)
}

/**
 * @param {string} subKey
 * @returns {(key: string, data?: object) => string}
 */
export function subLocalize(subKey) {
    return (key, data) => localize(`${subKey}.${key}`, data)
}

/**
 * @param {string} key
 * @param {string[]} keys
 */
export function hasLocalize(key, ...keys) {
    keys.unshift(`${MODULE_ID}.${key}`)
    return game.i18n.has(keys.join('.'), true)
}

/**@param {string} key*/
export function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

/**
 * @template T
 * @param {string} key
 * @param {T} value
 */
export function setSetting(key, value) {
    return game.settings.set(MODULE_ID, key, value)
}

/**
 * @param {string} str
 * @param {'warning' | 'info' | 'error' | boolean | object} [arg1]
 * @param {boolean | object} [arg2]
 * @param {boolean} [arg3]
 */
export function notify(str, arg1, arg2, arg3) {
    const type = typeof arg1 === 'string' ? arg1 : 'info'
    const data = typeof arg1 === 'object' ? arg1 : typeof arg2 === 'object' ? arg2 : undefined
    const permanent = typeof arg1 === 'boolean' ? arg1 : typeof arg2 === 'boolean' ? arg2 : arg3 ?? false

    ui.notifications.notify(localize(str, data), type, { permanent })
}

/**
 * @param {string} str
 * @param {boolean | object} [arg1]
 * @param {boolean} [arg2]
 */
export function warn(str, arg1, arg2) {
    notify(str, 'warning', arg1, arg2)
}

/**
 * @param {string} str
 * @param {boolean | object} [arg1]
 * @param {boolean} [arg2]
 */
export function info(str, arg1, arg2) {
    notify(str, 'info', arg1, arg2)
}

/**
 * @param {string} str
 * @param {boolean | object} [arg1]
 * @param {boolean} [arg2]
 */
export function error(str, arg1, arg2) {
    notify(str, 'error', arg1, arg2)
}

export function getCurrentModule() {
    return /** @type {Module} */ (game.modules.get(MODULE_ID))
}

/** @param {TableResult} result */
export function documentUuidFromTableResult(result) {
    if (result.type === CONST.TABLE_RESULT_TYPES.DOCUMENT) return `${result.documentCollection}.${result.documentId}`
    if (result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) return `Compendium.${result.documentCollection}.${result.documentId}`
    return undefined
}

/**
 * @param {string} uuid
 * @param {string} name
 */
export function chatUUID(uuid, name) {
    return `@UUID[${uuid}]{${name}}`
}
