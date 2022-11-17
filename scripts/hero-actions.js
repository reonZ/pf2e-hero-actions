import { documentUuidFromTableResult, error, getFlag, getSetting, localize, setFlag } from './utils/foundry.js'

const DECK_PACK = 'pf2e.hero-point-deck'
const TABLE_PACK = 'pf2e.rollable-tables'
const TABLE_ID = 'zgZoI7h0XjjJrrNK'
const TABLE_UUID = `Compendium.${TABLE_PACK}.${TABLE_ID}`
const ICON = 'systems/pf2e/icons/features/feats/heroic-recovery.webp'

/** @param {string | undefined} uuid */
async function getTableFromUuid(uuid) {
    if (!uuid) return undefined
    const table = await fromUuid(uuid)
    return table && table instanceof RollTable ? table : undefined
}

export async function getDefaultCompendiumTable() {
    return /** @type {Promise<RollTable>} */ (getTableFromUuid(TABLE_UUID))
}

export async function getDefaultWorldTable() {
    return game.tables.find(x => x.getFlag('core', 'sourceId') === TABLE_UUID)
}

export async function getCustomTable() {
    return getTableFromUuid(getSetting('tableUUID'))
}

export async function getDeckTable() {
    return (await getCustomTable()) ?? (await getDefaultWorldTable()) ?? (await getDefaultCompendiumTable())
}

/** @param {CharacterPF2e} actor */
export function getHeroActions(actor) {
    const actions = /** @type {Array<HeroAction | string>} */ (getFlag(actor, 'heroActions') ?? [])
    const pack = game.packs.get(DECK_PACK)
    if (!pack) return []

    return /** @type {HeroAction []} */ (
        actions
            .map(action => {
                if (typeof action !== 'string') return action
                const entry = pack.index.get(action)
                if (!entry) return undefined
                return { name: entry.name, uuid: `Compendium.${DECK_PACK}.${entry._id}` }
            })
            .filter(x => x)
    )
}

/** @param {string} uuid */
export async function getHeroActionDetails(uuid) {
    const document = await fromUuid(uuid)
    if (!(document instanceof JournalEntry)) return undefined

    const page = document.pages.contents[0]

    let text = page.text.content
    if (text && document.pack === DECK_PACK) text = text.replace(/^<p>/, '<p><strong>Trigger</strong> ')

    return text ? { name: document.name, description: text } : undefined
}

/**
 * @param {CharacterPF2e} actor
 * @param {HeroAction[]} actions
 */
export function setHeroActions(actor, actions) {
    return setFlag(actor, 'heroActions', actions)
}

/** @param {RollTable} [table] */
export function getTableSource(unique = true, table) {
    const source = {
        name: localize('table.name'),
        replacement: !unique,
        img: ICON,
        description: localize('table.description'),
    }
    if (!table) return source
    return mergeObject(duplicate(table._source), source)
}

export async function createDefautActionsTable(unique = true) {
    const table = /** @type {RollTable} */ (await fromUuid(TABLE_UUID))
    const source = getTableSource(unique, table)
    return /** @type {Promise<RollTable>} */ (RollTable.create(source, { temporary: false }))
}

export function createCustomActionsTable(unique = true) {
    const source = getTableSource(unique)
    return /** @type {Promise<RollTable>} */ (RollTable.create(source, { temporary: false }))
}

export async function drawHeroAction() {
    const table = await getDeckTable()

    if (!table.formula) {
        if (game.user.isGM) {
            await table.normalize()
        } else {
            error('table.noFormula', true)
            return null
        }
    }

    if (!table.replacement) {
        const drawn = table.results.filter(r => !r.drawn)
        if (!drawn.length) await table.resetResults()
    }

    const draw = (await table.draw({ displayChat: false })).results[0]
    const uuid = documentUuidFromTableResult(draw)

    if (uuid) return { uuid, name: draw.text }

    error('table.error', true)
    return undefined
}
