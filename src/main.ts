import { getCurrentModule } from '@utils/foundry/module'
import { registerSetting } from '@utils/foundry/settings'
import { isFirstGM } from '@utils/foundry/user'
import { setModuleID } from '@utils/module'
import { socketOn } from '@utils/socket'
import {
    discardHeroActions,
    drawHeroAction,
    drawHeroActions,
    getHeroActionDetails,
    getHeroActions,
    sendActionToChat,
    tradeHeroAction,
    useHeroAction,
} from './actions'
import { createTable, removeHeroActions } from './api'
import { refreshSheets, renderCharacterSheetPF2e } from './sheet'
import { onTradeAccepted, onTradeError, onTradeRejected, onTradeRequest } from './trade'

export const MODULE_ID = 'pf2e-hero-actions'
setModuleID(MODULE_ID)

Hooks.on('renderCharacterSheetPF2e', renderCharacterSheetPF2e)

Hooks.once('init', () => {
    registerSetting({
        name: 'tableUUID',
        type: String,
        default: '',
        config: true,
    })

    registerSetting({
        name: 'trade',
        type: Boolean,
        default: false,
        config: true,
        onChange: refreshSheets,
    })
})

Hooks.once('ready', () => {
    socketOn(onPacketReceived)

    getCurrentModule<HeroActionsApi>().api = {
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
        getCurrentModule<HeroActionsApi>().api.createTable = createTable
        getCurrentModule<HeroActionsApi>().api.removeHeroActions = removeHeroActions
    }
})

function onPacketReceived(packet: Packet) {
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
