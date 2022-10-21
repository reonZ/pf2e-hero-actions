import MODULE_ID from './module.js'

/** @param {...string} path */
export function templatePath(...path) {
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
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
        options.name = getSettingLocalizationPath(name, 'Name')
        options.hint = getSettingLocalizationPath(name, 'Hint')
    }
    game.settings.register(MODULE_ID, name, options)
}

/**
 * @param {RequiredBy<SettingSubmenuConfig, 'name'>} options
 * options.restricted = true
 *
 * options.icon = 'fas fa-cogs'
 */
export function registerSettingMenu(options) {
    const name = options.name
    options.name = getSettingLocalizationPath('Menus', name, 'Name')
    options.label = getSettingLocalizationPath('Menus', name, 'Label')
    options.hint = getSettingLocalizationPath('Menus', name, 'Hint')
    options.restricted = options.restricted ?? true
    options.icon = options.icon ?? 'fas fa-cogs'
    game.settings.registerMenu(MODULE_ID, name, options)
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
