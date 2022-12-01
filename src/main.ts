import { getCurrentModule } from './@utils/foundry/module'
import { registerSetting } from './@utils/foundry/settings'
import { registerLocalizeHelper } from './@utils/handlebars'
import { socketOn } from './@utils/socket'
import { getHeroActions, useHeroAction } from './actions'
import { createTable, removeHeroActions } from './helpers'
import { refreshSheets, renderCharacterSheetPF2e } from './sheet'
import { onTradeAccepted, onTradeError, onTradeRejected, onTradeRequest } from './trade'

Hooks.once('init', () => {
    registerLocalizeHelper()

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

    getCurrentModule().api = {
        createTable,
        removeHeroActions,
        getHeroActions,
        useHeroAction,
    }
})

Hooks.on('renderCharacterSheetPF2e', renderCharacterSheetPF2e)

export function onPacketReceived(packet: Packet) {
    switch (packet.type) {
        case 'trade-reject':
            if (packet.sender.id !== game.user.id) return
            onTradeRejected(packet)
            break
        case 'trade-accept':
            if (!game.user.isGM) return
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
