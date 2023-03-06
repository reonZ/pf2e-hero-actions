import { Trade } from '@apps/trade'
import { getFlag } from '@utils/foundry/flags'
import { localize, subLocalize } from '@utils/foundry/localize'
import { error, warn } from '@utils/foundry/notification'
import { templatePath } from '@utils/foundry/path'
import { getSetting } from '@utils/foundry/settings'
import { chatUUID } from '@utils/foundry/uuid'
import { drawHeroAction, getHeroActionDetails, getHeroActions, setHeroActions, useHeroAction } from './actions'

export async function renderCharacterSheetPF2e(sheet: CharacterSheetPF2e, $html: JQuery) {
    const actor = sheet.actor
    if (actor.pack || !actor.id || !game.actors.has(actor.id)) return
    await addHeroActions($html, actor)
    addEvents($html, actor)
}

async function addHeroActions(html: JQuery, actor: CharacterPF2e) {
    const actions = getHeroActions(actor)
    const diff = actor.heroPoints.value - actions.length
    const isOwner = actor.isOwner

    const template = await renderTemplate(templatePath('sheet.hbs'), {
        owner: isOwner,
        list: actions,
        canUse: diff >= 0 && isOwner,
        canDraw: diff > 0 && isOwner,
        canTrade: getSetting('trade'),
        mustDiscard: diff < 0,
        diff: Math.abs(diff),
        i18n: subLocalize('templates.heroActions'),
    })

    html.find('.tab[data-tab="actions"] .actions-panel[data-tab="encounter"] > .strikes-list:not(.skill-action-list)')
        .first()
        .after(template)
}

function addEvents(html: JQuery, actor: CharacterPF2e) {
    const $list = html.find('.tab.actions .heroActions-list')
    $list.find('[data-action=draw]').on('click', event => onClickHeroActionsDraw(actor, event))
    $list.find('[data-action=expand]').on('click', onClickHeroActionExpand)
    $list.find('[data-action=use]').on('click', event => onClickHeroActionUse(actor, event))
    $list.find('[data-action=display]').on('click', event => onClickHeroActionDisplay(actor, event))
    $list.find('[data-action=discard]').on('click', onClickHeroActionDiscard)
    $list.find('[data-action=discard-selected]').on('click', () => onClickHeroActionsDiscard(actor, html))
    html.find('[data-action=hero-actions-trade]').on('click', () => onClickHeroActionsTrade(actor))
}

function onClickHeroActionsTrade(actor: CharacterPF2e) {
    const actions = getFlag<Array<any>>(actor, 'heroActions')
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

async function onClickHeroActionExpand(event: JQuery.ClickEvent<any, any, HTMLElement>) {
    event.preventDefault()

    const $action = $(event.currentTarget).closest('.action')
    const $summary = $action.find('.item-summary')

    if (!$summary.hasClass('loaded')) {
        const uuid = $action.attr('data-uuid')!
        const details = await getHeroActionDetails(uuid)
        if (!details) return

        const text = await TextEditor.enrichHTML(details.description, { async: true })

        $summary.find('.item-description').html(text)
        $summary.addClass('loaded')
    }

    $action.toggleClass('expanded')
}

async function onClickHeroActionDisplay(actor: CharacterPF2e, event: JQuery.ClickEvent<any, any, HTMLElement>) {
    event.preventDefault()

    const uuid = $(event.currentTarget).closest('.action').attr('data-uuid')!
    const details = await getHeroActionDetails(uuid)
    if (!details) return error('details.missing')

    ChatMessage.create({
        content: `<h2>${details.name}</h2>${details.description}`,
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

function onClickHeroActionDiscard(event: JQuery.ClickEvent<any, any, HTMLElement>) {
    event.preventDefault()

    const action = $(event.currentTarget).closest('.action')
    const list = action.closest('.heroActions-list')

    action.toggleClass('discarded')

    const toDiscard = Number(list.attr('data-discard') ?? '0')
    const $discarded = list.find('.action.discarded')

    list.toggleClass('discardable', $discarded.length === toDiscard)
}

async function onClickHeroActionsDiscard(actor: CharacterPF2e, html: JQuery) {
    const discarded = html.find('.tab.actions .heroActions-list .action.discarded')
    const uuids = discarded.toArray().map(x => x.dataset.uuid)
    const actions = getHeroActions(actor)
    const removed: HeroAction[] = []

    for (const uuid of uuids) {
        const index = actions.findIndex(x => x.uuid === uuid)
        if (index === -1) continue
        removed.push(actions[index]!)
        actions.splice(index, 1)
    }

    setHeroActions(actor, actions)

    const display = removed.map(x => chatUUID(x.uuid, x.name))
    ChatMessage.create({
        flavor: `<h4 class="action">${localize('actions-discard.header', { nb: display.length })}</h4>`,
        content: display.map(x => `<div>${x}</div>`).join(''),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

async function onClickHeroActionsDraw(actor: CharacterPF2e, event: JQuery.ClickEvent) {
    event.preventDefault()

    const actions = getHeroActions(actor)
    const nb = actor.heroPoints.value - actions.length

    const drawn = /** @type {HeroAction[]} */ []
    for (let i = 0; i < nb; i++) {
        const action = await drawHeroAction()

        if (action === undefined) continue
        else if (action === null) return

        actions.push(action)
        drawn.push(action)
    }

    if (!drawn.length) return

    setHeroActions(actor, actions)

    const display = drawn.map(x => chatUUID(x.uuid, x.name))
    ChatMessage.create({
        flavor: `<h4 class="action">${localize('actions-draw.header', { nb: display.length })}</h4>`,
        content: display.map(x => `<div>${x}</div>`).join(''),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

async function onClickHeroActionUse(actor: CharacterPF2e, event: JQuery.ClickEvent<any, any, HTMLElement>) {
    event.preventDefault()
    const uuid = $(event.currentTarget).closest('.action').attr('data-uuid')!
    useHeroAction(actor, uuid)
}

export function refreshSheets() {
    Object.values(ui.windows).forEach(x => {
        if (x instanceof ActorSheet && x.actor.type === 'character') {
            x.render(true)
        }
    })
}
