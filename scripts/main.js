import { createTable, removeHeroActions } from './helpers.js'
import { renderCharacterSheetPF2e } from './sheet.js'
import { getCurrentModule, registerSetting } from './utils/foundry.js'
import { registerLocalize } from './utils/handlebars.js'

Hooks.once('init', () => {
    registerLocalize()

    registerSetting({
        name: 'tableUUID',
        type: String,
        config: true,
        default: '',
    })
})

Hooks.once('ready', () => {
    if (!game.user.isGM) return
    getCurrentModule().api = {
        createTable: createTable,
        removeHeroActions: removeHeroActions,
    }
})

Hooks.on('renderCharacterSheetPF2e', renderCharacterSheetPF2e)
