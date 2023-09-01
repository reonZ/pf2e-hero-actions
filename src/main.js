import { MODULE_ID, getSetting, isFirstGM, localize, setSetting, socketOn } from './module'
import { renderCharacterSheetPF2e } from './sheet'
import {
    getHeroActions,
    useHeroAction,
    getHeroActionDetails,
    drawHeroAction,
    drawHeroActions,
    sendActionToChat,
    discardHeroActions,
    tradeHeroAction,
} from './actions'
import { onTradeAccepted, onTradeError, onTradeRejected, onTradeRequest } from './trade'
import { createTable, removeHeroActions } from './api'

Hooks.once('init', () => {
    registerSetting({
        name: 'tableUUID',
        type: String,
        default: '',
    })

    registerSetting({
        name: 'trade',
        type: Boolean,
        default: false,
        onChange: refreshSheets,
    })

    registerSetting({
        name: 'private',
        type: Boolean,
        default: false,
    })

    registerSetting({
        name: 'migrated',
        type: Number,
        default: 0,
        config: false,
    })
})

Hooks.once('ready', async () => {
    socketOn(onSocket)

    const module = game.modules.get(MODULE_ID)

    module.api = {
        getHeroActions,
        useHeroAction,
        getHeroActionDetails,
        drawHeroAction,
        drawHeroActions,
        sendActionToChat,
        discardHeroActions,
        tradeHeroAction,
    }

    if (game.user.isGM) {
        module.api.createTable = createTable
        module.api.removeHeroActions = removeHeroActions

        await manageMigrations()
    }
})

Hooks.on('renderCharacterSheetPF2e', renderCharacterSheetPF2e)

function onSocket(packet) {
    switch (packet.type) {
        case 'trade-reject':
            if (packet.sender.id !== game.user.id) return
            onTradeRejected(packet)
            break
        case 'trade-accept':
            if (!isFirstGM()) return
            onTradeAccepted(packet)
            break
        case 'trade-request':
            if (packet.receiver.id !== game.user.id) return
            onTradeRequest(packet)
            break
        case 'trade-error':
            if (!packet.users.includes(game.user.id)) return
            onTradeError(packet.error)
            break
    }
}

async function manageMigrations() {
    const migrated = getSetting('migrated') ?? 0

    // pf2e system 5.0.1
    if (migrated < 1) {
        ChatMessage.create({ content: localize('migration.system-change'), whisper: game.user.id })
    }

    setSetting('migrated', 1)
}

function registerSetting(options) {
    const name = options.name
    options.scope = options.scope ?? 'world'
    options.config = options.config ?? true
    if (options.config) {
        options.name = `${MODULE_ID}.settings.${name}.name`
        options.hint = `${MODULE_ID}.settings.${name}.hint`
    }
    game.settings.register(MODULE_ID, name, options)
}

function refreshSheets() {
    Object.values(ui.windows).forEach(x => {
        if (x instanceof ActorSheet && x.actor.type === 'character') {
            x.render(true)
        }
    })
}
