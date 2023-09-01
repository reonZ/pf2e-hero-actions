import {
    discardHeroActions,
    drawHeroActions,
    getHeroActionDetails,
    getHeroActions,
    sendActionToChat,
    tradeHeroAction,
    useHeroAction,
} from './actions'
import { getSetting, subLocalize, templatePath } from './module'

export async function renderCharacterSheetPF2e(sheet, html) {
    const actor = sheet.actor
    if (actor.pack || !actor.id || !game.actors.has(actor.id)) return
    await addHeroActions(html, actor)
    addEvents(html, actor)
}

async function addHeroActions(html, actor) {
    const actions = getHeroActions(actor)
    const diff = actor.heroPoints.value - actions.length
    const isOwner = actor.isOwner
    const localize = subLocalize('templates.heroActions')

    const template = await renderTemplate(templatePath('sheet.hbs'), {
        owner: isOwner,
        list: actions,
        canUse: diff >= 0 && isOwner,
        canDraw: diff > 0 && isOwner,
        canTrade: getSetting('trade'),
        mustDiscard: diff < 0,
        diff: Math.abs(diff),
        i18n: (key, { hash }) => localize(key, hash),
    })

    html.find(
        '.sheet-body .sheet-content [data-tab=actions] .tab-content .actions-panels [data-tab=encounter] > .strikes-list:not(.skill-action-list)'
    )
        .first()
        .after(template)
}

function addEvents(html, actor) {
    const $list = html.find('.tab.actions .heroActions-list')
    $list.find('[data-action=draw]').on('click', event => onClickHeroActionsDraw(actor, event))
    $list.find('[data-action=expand]').on('click', onClickHeroActionExpand)
    $list.find('[data-action=use]').on('click', event => onClickHeroActionUse(actor, event))
    $list.find('[data-action=display]').on('click', event => onClickHeroActionDisplay(actor, event))
    $list.find('[data-action=discard]').on('click', onClickHeroActionDiscard)
    $list.find('[data-action=discard-selected]').on('click', () => onClickHeroActionsDiscard(actor, html))
    html.find('[data-action=hero-actions-trade]').on('click', () => tradeHeroAction(actor))
}

async function onClickHeroActionExpand(event) {
    event.preventDefault()

    const action = $(event.currentTarget).closest('.action')
    const summary = action.find('.item-summary')

    if (!summary.hasClass('loaded')) {
        const uuid = action.attr('data-uuid')
        const details = await getHeroActionDetails(uuid)
        if (!details) return

        const text = await TextEditor.enrichHTML(details.description, { async: true })

        summary.find('.item-description').html(text)
        summary.addClass('loaded')
    }

    action.toggleClass('expanded')
}

async function onClickHeroActionDisplay(actor, event) {
    event.preventDefault()
    const uuid = $(event.currentTarget).closest('.action').attr('data-uuid')
    sendActionToChat(actor, uuid)
}

function onClickHeroActionDiscard(event) {
    event.preventDefault()

    const action = $(event.currentTarget).closest('.action')
    const list = action.closest('.heroActions-list')

    action.toggleClass('discarded')

    const toDiscard = Number(list.attr('data-discard') ?? '0')
    const $discarded = list.find('.action.discarded')

    list.toggleClass('discardable', $discarded.length === toDiscard)
}

async function onClickHeroActionsDiscard(actor, html) {
    const discarded = html.find('.tab.actions .heroActions-list .action.discarded')
    const uuids = discarded.toArray().map(x => x.dataset.uuid)
    discardHeroActions(actor, uuids)
}

async function onClickHeroActionsDraw(actor, event) {
    event.preventDefault()
    drawHeroActions(actor)
}

async function onClickHeroActionUse(actor, event) {
    event.preventDefault()
    const uuid = $(event.currentTarget).closest('.action').attr('data-uuid')
    useHeroAction(actor, uuid)
}
