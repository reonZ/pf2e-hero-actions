import { getHeroActionsIndexes } from './actor.js'
import MODULE_ID from './utils/module.js'
import {
    drawRandomHeroAction,
    drawUniqueHeroAction,
    formatHeroActionUUID,
    getHeroActionDetails,
    isHeroActionVariantUnique,
} from './hero-actions.js'
import { getSetting, setFlag, templatePath } from './utils/foundry.js'

/** @typedef {import('./hero-actions.js').HeroActionIndex} HeroActionIndex */

/**
 * @param {CharacterSheetPF2e} sheet
 * @param {JQuery} $html
 */
export async function onRenderCharacterSheetPF2e(sheet, $html) {
    const actor = sheet.actor
    if (actor.pack || !actor.id || !game.actors.has(actor.id) || getSetting('Variant') === 'none') return

    const actions = getHeroActionsIndexes(actor)
    const diff = actor.heroPoints.value - actions.length
    const isOwner = actor.isOwner

    const template = await renderTemplate(templatePath('sheet.html'), {
        owner: isOwner,
        list: actions,
        canUse: diff >= 0 && isOwner,
        canDraw: diff > 0 && isOwner,
        mustDiscard: diff < 0,
        diff: Math.abs(diff),
    })

    const strikesList = $html
        .find('.tab[data-tab="actions"] .actions-panel[data-tab="encounter"] > .strikes-list:not(.skill-action-list)')
        .first()
    strikesList.after(template)

    addEventToTemplate(actor, $html)
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery} $html
 */
function addEventToTemplate(actor, $html) {
    const $list = $html.find('.tab.actions .heroActions-list')
    $list.find('[data-action=draw]').on('click', event => onClickHeroActionsDraw(actor, event))
    $list.find('[data-action=expand]').on('click', onClickHeroActionExpand)
    $list.find('[data-action=use]').on('click', event => onClickHeroActionUse(actor, event))
    $list.find('[data-action=display]').on('click', event => onClickHeroActionDisplay(actor, event))
    $list.find('[data-action=discard]').on('click', onClickHeroActionDiscard)
    $list.find('[data-action=discard-selected]').on('click', () => onClickHeroActionsDiscard(actor, $html))
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent} event
 */
async function onClickHeroActionsDraw(actor, event) {
    event.preventDefault()

    const actions = getHeroActionsIndexes(actor)
    const drawFunction = isHeroActionVariantUnique() ? drawUniqueHeroAction : drawRandomHeroAction

    const nb = actor.heroPoints.value - actions.length
    const drawn = /** @type {HeroActionIndex[]} */ ([])
    for (let i = 0; i < nb; i++) {
        const index = await drawFunction()
        if (!index) return
        actions.push(index)
        drawn.push(index)
    }

    setFlag(
        actor,
        'heroActions',
        actions.map(x => x._id)
    )

    const template = templatePath('draw-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, { actions: drawn.map(x => formatHeroActionUUID(x)) }),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
async function onClickHeroActionExpand(event) {
    event.preventDefault()

    const $action = $(event.currentTarget).closest('.action')
    const $summary = $action.find('.item-summary')

    if (!$summary.hasClass('loaded')) {
        const action = await getHeroActionDetails(/** @type {string} */ ($action.attr('data-id')))
        if (!action) return

        const text = await TextEditor.enrichHTML(action.description, { async: true })

        $summary.find('.item-description').html(text)
        $summary.addClass('loaded')
    }

    $action.toggleClass('expanded')
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent<any, any, HTMLElement>} event
 */
async function onClickHeroActionUse(actor, event) {
    event.preventDefault()

    const points = actor.heroPoints.value
    if (points < 1) {
        ui.notifications.warn('You need at least 1 Hero Point to use a Hero Action')
        return
    }

    const id = /** @type {string} */ ($(event.currentTarget).closest('.action').attr('data-id'))
    const actions = getHeroActionsIndexes(actor)

    const index = actions.findIndex(x => x._id === id)
    if (index === -1) return

    const action = await getHeroActionDetails(id)
    if (!action) return

    actions.splice(index, 1)

    actor.update({
        ['system.resources.heroPoints.value']: points - 1,
        [`flags.${MODULE_ID}.heroActions`]: actions.map(x => x._id),
    })

    const template = templatePath('use-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, action),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent<any, any, HTMLElement>} event
 */
async function onClickHeroActionDisplay(actor, event) {
    event.preventDefault()

    const id = /** @type {string} */ ($(event.currentTarget).closest('.action').attr('data-id'))
    const action = await getHeroActionDetails(id)
    if (!action) return

    const template = templatePath('display-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, action),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
function onClickHeroActionDiscard(event) {
    event.preventDefault()

    const $action = $(event.currentTarget).closest('.action')
    const $list = $action.closest('.heroActions-list')

    $action.toggleClass('discarded')

    const toDiscard = Number($list.attr('data-discard') ?? '0')
    const $discarded = $list.find('.action.discarded')

    $list.toggleClass('discardable', $discarded.length === toDiscard)
}

/**
 * @param {ActorPF2e} actor
 * @param {JQuery} $html
 */
async function onClickHeroActionsDiscard(actor, $html) {
    const $discarded = $html.find('.tab.actions .heroActions-list .action.discarded')
    const ids = $discarded.toArray().map(x => x.dataset.id)
    const actions = getHeroActionsIndexes(actor)

    const removed = /** @type {HeroActionIndex[]} */ ([])
    for (const id of ids) {
        const index = actions.findIndex(x => x._id === id)
        if (index === -1) continue
        removed.push(actions[index])
        actions.splice(index, 1)
    }

    setFlag(
        actor,
        'heroActions',
        actions.map(x => x._id)
    )

    const template = templatePath('discard-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, { actions: removed.map(x => formatHeroActionUUID(x)) }),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}
