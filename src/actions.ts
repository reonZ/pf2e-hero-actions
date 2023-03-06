import { getFlag, setFlag } from '@utils/foundry/flags'
import { localize } from '@utils/foundry/localize'
import { error, warn } from '@utils/foundry/notification'
import { flagsUpdatePath } from '@utils/foundry/path'
import { getSetting } from '@utils/foundry/settings'
import { documentUuidFromTableResult } from '@utils/foundry/uuid'

const DECK_PACK = 'pf2e.hero-point-deck' as const
const TABLE_PACK = 'pf2e.rollable-tables' as const
const TABLE_ID = 'zgZoI7h0XjjJrrNK' as const
const TABLE_UUID = `Compendium.${TABLE_PACK}.${TABLE_ID}` as const
const ICON = 'systems/pf2e/icons/features/feats/heroic-recovery.webp' as const

async function getTableFromUuid(uuid: string | undefined) {
    if (!uuid) return undefined
    const table = await fromUuid(uuid)
    return table && table instanceof RollTable ? table : undefined
}

export async function getDefaultCompendiumTable() {
    return getTableFromUuid(TABLE_UUID) as Promise<RollTable>
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

export function getHeroActions(actor: CharacterPF2e): HeroAction[] {
    const actions = getFlag<Array<HeroAction | string>>(actor, 'heroActions') ?? []
    const pack = game.packs.get(DECK_PACK)

    return actions
        .map(action => {
            if (typeof action !== 'string') return action
            if (!pack) return undefined
            const entry = pack.index.get(action)
            if (!entry) return undefined
            return { name: entry.name, uuid: `Compendium.${DECK_PACK}.${entry._id}` }
        })
        .filter(x => x) as HeroAction[]
}

export async function useHeroAction(actor: CharacterPF2e, uuid: string) {
    const points = actor.heroPoints.value
    if (points < 1) return warn('use.noPoints')

    const actions = getHeroActions(actor)

    const index = actions.findIndex(x => x.uuid === uuid)
    if (index === -1) return

    const details = await getHeroActionDetails(uuid)
    if (!details) error('use.noDetails')

    actions.splice(index, 1)

    if (details) {
        actor.update({
            ['system.resources.heroPoints.value']: points - 1,
            [flagsUpdatePath('heroActions')]: actions,
        })

        ChatMessage.create({
            flavor: `<h4 class="action">${localize('actions-use.header')}</h4>`,
            content: `<h2>${details.name}</h2>${details.description}`,
            speaker: ChatMessage.getSpeaker({ actor }),
        })
    } else setFlag(actor, 'heroActions', actions)
}

export async function getHeroActionDetails(uuid: string) {
    const document = await fromUuid(uuid)
    if (!(document instanceof JournalEntry)) return undefined

    const page = document.pages.contents[0]

    let text = page?.text.content
    if (text && document.pack === DECK_PACK) text = text.replace(/^<p>/, '<p><strong>Trigger</strong> ')

    return text ? { name: document.name, description: text } : undefined
}

export function setHeroActions(actor: CharacterPF2e, actions: HeroAction[]) {
    return setFlag(actor, 'heroActions', actions)
}

export function getTableSource(unique = true, table?: RollTable) {
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
    const table = await fromUuid<RollTable>(TABLE_UUID)
    const source = getTableSource(unique, table!)
    return RollTable.create(source, { temporary: false }) as Promise<RollTable>
}

export function createCustomActionsTable(unique = true) {
    const source = getTableSource(unique)
    return RollTable.create(source, { temporary: false }) as Promise<RollTable>
}

export async function drawHeroAction() {
    const table = await getDeckTable()

    if (!table) {
        error('table.drawError', true)
        return null
    }

    if (!table.formula) {
        if (game.user.isGM) {
            if (table.compendium) {
                error('table.noFormulaCompendium', true)
                return null
            }
            await table.normalize()
        } else {
            error('table.noFormula', true)
            return null
        }
    }

    if (table.replacement) {
        const drawn = table.results.filter(r => !r.drawn)
        if (!drawn.length) await table.resetResults()
    }

    const draw = (await table.draw({ displayChat: false })).results[0]
    if (!draw) return

    const uuid = documentUuidFromTableResult(draw)
    if (uuid) return { uuid, name: draw.text }
}
