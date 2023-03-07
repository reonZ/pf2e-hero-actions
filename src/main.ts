import { setModuleID } from '@utils/module'
import { socketOn } from '@utils/socket'
import { registerSetting } from '@utils/foundry/settings'
import { getCurrentModule } from '@utils/foundry/module'
import { isFirstGM } from '@utils/foundry/user'
import { createTable, removeHeroActions } from './api'
import { getHeroActions, useHeroAction } from './actions'
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

    if (!game.user.isGM) return

    getCurrentModule<HeroActionsApi>().api = {
        createTable,
        removeHeroActions,
        getHeroActions,
        useHeroAction,
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
