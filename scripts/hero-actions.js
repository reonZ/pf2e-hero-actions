import { getSetting, localize } from './utils/foundry.js'

const TABLE_ID = 'zgZoI7h0XjjJrrNK'
const TABLE_UUID = `Compendium.pf2e.rollable-tables.${TABLE_ID}`

/** @typedef {{ _id: string; name: string }} HeroActionIndex */

export function getHeroDeckPack() {
    return /** @type {CompendiumCollection<JournalEntry>} */ (game.packs.get('pf2e.hero-point-deck'))
}

export function getCompendiumHeroDeckTable() {
    const pack = /** @type {CompendiumCollection<RollTable>} */ (game.packs.get('pf2e.rollable-tables'))
    return /** @type {Promise<RollTable>} */ (pack.getDocument(TABLE_ID))
}

export function getWorldHeroDeckTable() {
    const id = getSetting('DeckId')
    // Hero Deck table with user provided id
    const table = id ? game.tables.get(id) : undefined
    // or the first Hero Deck table found in the world
    return table ?? game.tables.find(x => x.getFlag('core', 'sourceId') === TABLE_UUID)
}

export async function createWorldHeroDeckTable() {
    const source = duplicate((await getCompendiumHeroDeckTable())._source)
    source.replacement = false
    source.name = localize('Table.Name')
    return /** @type {RollTable} */ (await RollTable.create(source, { temporary: false }))
}

export function isHeroActionVariantUnique() {
    return getSetting('Variant') === 'unique'
}

/** @param {HeroActionIndex} action */
export function formatHeroActionUUID(action) {
    return `@UUID[Compendium.pf2e.hero-point-deck.${action._id}]{${action.name}}`
}

/** @param {string} id */
export async function getHeroActionDetails(id) {
    const pack = getHeroDeckPack()
    const entry = await pack.getDocument(id)
    if (!entry) return null

    const page = entry.pages.contents[0]
    const text = page.text.content?.replace(/^<p>/, '<p><strong>Trigger</strong> ')

    return text ? { id: entry.id, name: entry.name, description: text } : null
}

export async function drawUniqueHeroAction() {
    let table = getWorldHeroDeckTable()

    if (!table) {
        if (game.user.isGM) {
            // because we are the GM, we can create the missing table
            table = await createWorldHeroDeckTable()
        } else {
            ui.notifications.warn(localize('Table.MissingWarn'))
            return undefined
        }
    }

    if (!table) {
        ui.notifications.error(localize('Table.MissingError'))
        return undefined
    } else if (!table.formula) {
        if (game.user.isGM) {
            // again, we are GM so we can fix the mess
            await table.update({ formula: `1d${table.results.size}` })
        } else {
            ui.notifications.warn(localize('Table.NoFormula'))
            return undefined
        }
    }

    const drawn = table.results.filter(r => !r.drawn)
    if (!drawn.length) {
        // the whole table has been drawn, we reset
        await table.resetResults()
    }

    if (table.replacement) {
        if (game.user.isGM) {
            // same stuff
            await table.update({ replacement: false })
        } else {
            ui.notifications.warn(localize('Table.Replacement'))
            return undefined
        }
    }

    const draw = (await table.draw({ displayChat: false })).results[0]
    return { _id: draw.documentId, name: draw.text }
}

export async function drawRandomHeroAction() {
    const deck = await getCompendiumHeroDeckTable()
    const draw = (await deck.roll()).results[0]
    return { _id: draw.documentId, name: draw.text }
}
