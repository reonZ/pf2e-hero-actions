import { Trade } from './apps/trade'
import { MODULE_ID, chatUUID, documentUuidFromTableResult, error, getFlag, getSetting, localize, setFlag, warn } from './module'

const JOURNAL_UUID = 'Compendium.pf2e.journals.JournalEntry.BSp4LUSaOmUyjBko'
export const TABLE_UUID = 'Compendium.pf2e.rollable-tables.RollTable.zgZoI7h0XjjJrrNK'

async function getTableFromUuid(uuid) {
    if (!uuid) return undefined
    const table = await fromUuid(uuid)
    return table && table instanceof RollTable ? table : undefined
}

export async function getDefaultCompendiumTable() {
    return getTableFromUuid(TABLE_UUID)
}

export function getDefaultWorldTable() {
    return game.tables.find(x => x.getFlag('core', 'sourceId') === TABLE_UUID)
}

export async function getCustomTable() {
    return getTableFromUuid(getSetting('tableUUID'))
}

export async function getDeckTable() {
    return (await getCustomTable()) ?? getDefaultWorldTable() ?? (await getDefaultCompendiumTable())
}

export function getHeroActions(actor) {
    return getFlag(actor, 'heroActions') ?? []
}

export async function getHeroActionDetails(uuid) {
    let document = await fromUuid(uuid)
    if (!document) return undefined

    const parent = document instanceof JournalEntry ? document : document.parent
    const page = document instanceof JournalEntry ? document.pages.contents[0] : document

    let text = page?.text.content
    if (!text) return undefined

    if (parent.uuid === JOURNAL_UUID) text = text.replace(/^<p>/, '<p><strong>Trigger</strong> ')
    return { name: page.name, description: text }
}

export async function sendActionToChat(actor, uuid) {
    const details = await getHeroActionDetails(uuid)
    if (!details) return error('details.missing')

    ChatMessage.create({
        content: `<h2>${details.name}</h2>${details.description}`,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
    })
}

export async function discardHeroActions(actor, uuids) {
    uuids = typeof uuids === 'string' ? [uuids] : uuids

    const actions = getHeroActions(actor)
    const removed = []

    for (const uuid of uuids) {
        const index = actions.findIndex(x => x.uuid === uuid)
        if (index === -1) continue
        removed.push(actions[index])
        actions.splice(index, 1)
    }

    setHeroActions(actor, actions)

    const { content, size } = chatActions(removed)
    ChatMessage.create({
        flavor: `<h4 class="action">${localize('actions-discard.header', { nb: size })}</h4>`,
        content,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
    })
}

export function setHeroActions(actor, actions) {
    return setFlag(actor, 'heroActions', actions)
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

    if (table.replacement === false) {
        const notDrawn = table.results.some(r => !r.drawn)
        if (!notDrawn) await table.resetResults()
    }

    const draw = (await table.draw({ displayChat: false })).results[0]
    if (!draw) return

    const uuid = documentUuidFromTableResult(draw)
    if (uuid) return { uuid, name: await getLabelfromTableResult(draw, uuid) }
}

const RESULT_TEXT_REGEX = /@UUID\[[\w\.]+\]{([\w -]+)}/
async function getLabelfromTableResult(result, uuid) {
    if (result.type !== CONST.TABLE_RESULT_TYPES.TEXT) return result.text
    const label = RESULT_TEXT_REGEX.exec(result.text)?.[1]
    return label ?? (uuid && (await fromUuid(uuid))?.name)
}

export async function drawHeroActions(actor) {
    const actions = getHeroActions(actor)
    const nb = actor.heroPoints.value - actions.length

    const drawn = []
    for (let i = 0; i < nb; i++) {
        const action = await drawHeroAction()

        if (action === undefined) continue
        else if (action === null) return

        actions.push(action)
        drawn.push(action)
    }

    if (!drawn.length) return

    setHeroActions(actor, actions)

    const { content, size } = chatActions(drawn)
    const data = {
        flavor: `<h4 class="action">${localize('actions-draw.header', { nb: size })}</h4>`,
        content,
        speaker: ChatMessage.getSpeaker({ actor: actor }),
    }

    if (getSetting('private')) {
        data.type = CONST.CHAT_MESSAGE_TYPES.ROLL
        data.rollMode = CONST.DICE_ROLL_MODES.PRIVATE
    }

    ChatMessage.create(data)
}

export async function useHeroAction(actor, uuid) {
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
            [`flags.${MODULE_ID}.heroActions`]: actions,
        })

        ChatMessage.create({
            flavor: `<h4 class="action">${localize('actions-use.header')}</h4>`,
            content: `<h2>${details.name}</h2>${details.description}`,
            speaker: ChatMessage.getSpeaker({ actor }),
        })
    } else setFlag(actor, 'heroActions', actions)
}

export function tradeHeroAction(actor) {
    const actions = getFlag(actor, 'heroActions')
    if (!actions || !actions.length) {
        warn('no-action')
        return
    }

    const diff = actions.length - actor.heroPoints.value
    if (diff > 0) {
        warn('no-points', { nb: diff.toString() })
        return
    }

    new Trade(actor).render(true)
}

function chatActions(actions) {
    const links = actions.map(({ uuid, name }) => chatUUID(uuid, name))
    return {
        content: links.map(x => `<div style="line-height: 1.6;">${x}</div>`).join(''),
        size: links.length,
    }
}
