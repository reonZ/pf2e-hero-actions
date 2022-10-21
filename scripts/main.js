import { createWorldHeroDeckTable, getWorldHeroDeckTable } from './hero-actions.js'
import { onRenderCharacterSheetPF2e } from './sheet.js'
import { registerSetting } from './utils/foundry.js'
import { registerLocalize } from './utils/handlebars.js'

Hooks.once('init', onInit)
Hooks.on('renderCharacterSheetPF2e', onRenderCharacterSheetPF2e)

function onInit() {
    registerLocalize()

    registerSetting({
        name: 'Variant',
        type: String,
        default: 'none',
        config: true,
        choices: {
            none: 'pf2e-hero-actions.settings.Variant.Choices.none',
            random: 'pf2e-hero-actions.settings.Variant.Choices.random',
            unique: 'pf2e-hero-actions.settings.Variant.Choices.unique',
        },
        onChange: onHeroActionsSettingChanged,
    })

    registerSetting({
        name: 'DeckId',
        type: String,
        config: true,
        default: '',
    })
}

/** @param {'none' | 'random' | 'unique'} value */
async function onHeroActionsSettingChanged(value) {
    for (const id in ui.windows) {
        const window = ui.windows[id]
        if (window instanceof ActorSheet && window.actor.type === 'character') {
            window.render()
        }
    }

    let table = getWorldHeroDeckTable()
    // we create a Hero Deck Table if none exist
    if (!table && value === 'unique') table = await createWorldHeroDeckTable()
    table?.resetResults()
}
