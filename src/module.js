export const MODULE_ID = 'pf2e-hero-actions'

export function getSetting(key) {
    return game.settings.get(MODULE_ID, key)
}

export function setSetting(key, value) {
    return game.settings.set(MODULE_ID, key, value)
}

export function localize(...args) {
    let [key, data] = args
    key = `${MODULE_ID}.${key}`
    if (data) return game.i18n.format(key, data)
    return game.i18n.localize(key)
}

export function socketOn(callback) {
    game.socket.on(`module.${MODULE_ID}`, callback)
}

export function socketEmit(packet) {
    game.socket.emit(`module.${MODULE_ID}`, packet)
}

export function templatePath(...path) {
    path = path.filter(x => typeof x === 'string')
    return `modules/${MODULE_ID}/templates/${path.join('/')}`
}

export function getFlag(doc, key, fallback) {
    return doc.getFlag(MODULE_ID, key) ?? fallback
}

export function setFlag(doc, key, value) {
    return doc.setFlag(MODULE_ID, key, value)
}

export function subLocalize(subKey) {
    const fn = (...args) => localize(`${subKey}.${args[0]}`, args[1])

    Object.defineProperties(fn, {
        warn: {
            value: (...args) => warn(`${subKey}.${args[0]}`, args[1], args[2]),
            enumerable: false,
            configurable: false,
        },
        info: {
            value: (...args) => info(`${subKey}.${args[0]}`, args[1], args[2]),
            enumerable: false,
            configurable: false,
        },
        error: {
            value: (...args) => error(`${subKey}.${args[0]}`, args[1], args[2]),
            enumerable: false,
            configurable: false,
        },
        has: {
            value: key => hasLocalization(`${subKey}.${key}`),
            enumerable: false,
            configurable: false,
        },
        path: {
            value: key => localizePath(`${subKey}.${key}`),
            enumerable: false,
            configurable: false,
        },
        template: {
            value: (key, { hash }) => fn(key, hash),
            enumerable: false,
            configurable: false,
        },
    })

    return fn
}

function notify(str, arg1, arg2, arg3) {
    const type = typeof arg1 === 'string' ? arg1 : 'info'
    const data = typeof arg1 === 'object' ? arg1 : typeof arg2 === 'object' ? arg2 : undefined
    const permanent = typeof arg1 === 'boolean' ? arg1 : typeof arg2 === 'boolean' ? arg2 : arg3 ?? false

    ui.notifications.notify(localize(str, data), type, { permanent })
}

export function warn(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'warning', arg1, arg2)
}

export function info(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'info', arg1, arg2)
}

export function error(...args) {
    const [str, arg1, arg2] = args
    notify(str, 'error', arg1, arg2)
}

export function chatUUID(uuid, name) {
    if (name) return `@UUID[${uuid}]{${name}}`
    return `@UUID[${uuid}]`
}

const RESULT_TEXT_REGEX = /@UUID\[([\w\.]+)\]/
export function documentUuidFromTableResult(result) {
    if (result.type === CONST.TABLE_RESULT_TYPES.TEXT) return RESULT_TEXT_REGEX.exec(result.text)?.[1]
    if (result.type === CONST.TABLE_RESULT_TYPES.DOCUMENT) return `${result.documentCollection}.${result.documentId}`
    if (result.type === CONST.TABLE_RESULT_TYPES.COMPENDIUM) return `Compendium.${result.documentCollection}.${result.documentId}`
    return undefined
}

export function getCharacterOwner(actor, connected = false) {
    if (connected) return game.users.find(x => x.active && x.character === actor)
    return game.users.find(x => x.character === actor)
}

export function getOwner(doc, connected = false) {
    if (connected) return game.users.find(x => x.active && doc.testUserPermission(x, 'OWNER'))
    return game.users.find(x => doc.testUserPermission(x, 'OWNER'))
}

export function isFirstGM() {
    return game.user === game.users.activeGM
}
