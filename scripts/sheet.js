import { drawHeroAction, getHeroActionDetails, getHeroActions, setHeroActions } from './hero-actions.js'
import { chatUUID, error, setFlag, templatePath, warn } from './utils/foundry.js'
import MODULE_ID from './utils/module.js'

/**
 * @param {CharacterSheetPF2e} sheet
 * @param {JQuery} $html
 */
export async function renderCharacterSheetPF2e(sheet, $html) {
    const actor = sheet.actor
    if (actor.pack || !actor.id || !game.actors.has(actor.id)) return
    await addHeroActions($html, actor)
    addEvents($html, actor)
}

/**
 * @param {JQuery} $html
 * @param {CharacterPF2e} actor
 */
async function addHeroActions($html, actor) {
    const actions = getHeroActions(actor)
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

    $html
        .find('.tab[data-tab="actions"] .actions-panel[data-tab="encounter"] > .strikes-list:not(.skill-action-list)')
        .first()
        .after(template)
}

/**
 * @param {JQuery} $html
 * @param {CharacterPF2e} actor
 */
function addEvents($html, actor) {
    const $list = $html.find('.tab.actions .heroActions-list')
    $list.find('[data-action=draw]').on('click', event => onClickHeroActionsDraw(actor, event))
    $list.find('[data-action=expand]').on('click', onClickHeroActionExpand)
    $list.find('[data-action=use]').on('click', event => onClickHeroActionUse(actor, event))
    $list.find('[data-action=display]').on('click', event => onClickHeroActionDisplay(actor, event))
    $list.find('[data-action=discard]').on('click', onClickHeroActionDiscard)
    $list.find('[data-action=discard-selected]').on('click', () => onClickHeroActionsDiscard(actor, $html))
}

/** @param {JQuery.ClickEvent<any, any, HTMLElement>} event */
async function onClickHeroActionExpand(event) {
    event.preventDefault()

    const $action = $(event.currentTarget).closest('.action')
    const $summary = $action.find('.item-summary')

    if (!$summary.hasClass('loaded')) {
        const uuid = /** @type {string} */ ($action.attr('data-uuid'))
        const details = await getHeroActionDetails(uuid)
        if (!details) return

        const text = await TextEditor.enrichHTML(details.description, { async: true })

        $summary.find('.item-description').html(text)
        $summary.addClass('loaded')
    }

    $action.toggleClass('expanded')
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent<any, any, HTMLElement>} event
 */
async function onClickHeroActionDisplay(actor, event) {
    event.preventDefault()

    const uuid = /** @type {string} */ ($(event.currentTarget).closest('.action').attr('data-uuid'))
    const details = await getHeroActionDetails(uuid)
    if (!details) return error('details.missing')

    const template = templatePath('cards/display-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, details),
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
 * @param {CharacterPF2e} actor
 * @param {JQuery} $html
 */
async function onClickHeroActionsDiscard(actor, $html) {
    const $discarded = $html.find('.tab.actions .heroActions-list .action.discarded')
    const uuids = $discarded.toArray().map(x => x.dataset.uuid)
    const actions = getHeroActions(actor)
    const removed = /** @type {HeroAction[]} */ ([])

    for (const uuid of uuids) {
        const index = actions.findIndex(x => x.uuid === uuid)
        if (index === -1) continue
        removed.push(actions[index])
        actions.splice(index, 1)
    }

    setHeroActions(actor, actions)

    const template = templatePath('cards/discard-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, { actions: removed.map(x => chatUUID(x.uuid, x.name)) }),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent} event
 */
async function onClickHeroActionsDraw(actor, event) {
    event.preventDefault()

    const actions = getHeroActions(actor)
    const nb = actor.heroPoints.value - actions.length

    const drawn = /** @type {HeroAction[]} */ ([])
    for (let i = 0; i < nb; i++) {
        const action = await drawHeroAction()

        if (action === undefined) continue
        else if (action === null) return

        actions.push(action)
        drawn.push(action)
    }

    if (!drawn.length) return

    setHeroActions(actor, actions)

    const template = templatePath('cards/draw-card.html')
    ChatMessage.create({
        content: await renderTemplate(template, { actions: drawn.map(x => chatUUID(x.uuid, x.name)) }),
        speaker: ChatMessage.getSpeaker({ actor }),
    })
}

/**
 * @param {CharacterPF2e} actor
 * @param {JQuery.ClickEvent<any, any, HTMLElement>} event
 */
async function onClickHeroActionUse(actor, event) {
    event.preventDefault()

    const points = actor.heroPoints.value
    if (points < 1) return warn('use.noPoints')

    const uuid = /** @type {string} */ ($(event.currentTarget).closest('.action').attr('data-uuid'))
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

        const template = templatePath('cards/use-card.html')
        ChatMessage.create({
            content: await renderTemplate(template, details),
            speaker: ChatMessage.getSpeaker({ actor }),
        })
    } else setFlag(actor, 'heroActions', actions)
}
