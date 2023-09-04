import { TABLE_UUID, getDefaultWorldTable } from './actions'
import { info, localize, setFlag, setSetting, subLocalize, templatePath, warn } from './module'

const ICON = 'systems/pf2e/icons/features/feats/heroic-recovery.webp'

const localizeChoice = subLocalize('templates.createTable.choice')
const localizeDefaultConfirm = subLocalize('templates.createTable.default.confirm')
const localizeRemove = subLocalize('templates.removeActions')

export async function createTable() {
    const template = templatePath('dialogs/create-table.hbs')

    const buttons = {
        yes: {
            label: localizeChoice('create'),
            icon: '<i class="fas fa-border-all"></i>',
            callback: html => {
                const type = html.find('.window-content input[name="type"]:checked').val()
                const unique = html.find('.window-content input[name="draw"]:checked').val() === 'unique'
                return { type, unique }
            },
        },
        no: {
            label: localizeChoice('cancel'),
            icon: '<i class="fas fa-times"></i>',
            callback: () => null,
        },
    }

    const data = {
        content: await renderTemplate(template, { i18n: localizeChoice }),
        title: localizeChoice('title'),
        buttons,
        default: 'yes',
        close: () => null,
    }

    const result = await Dialog.wait(data, undefined, { id: 'pf2e-hero-actions-create-table' })
    if (!result) return

    if (result.type === 'default') createDefaultTable(result.unique)
    else createCustomTable(result.unique)
}

export async function removeHeroActions() {
    const template = templatePath('dialogs/remove-actions.hbs')

    const buttons = {
        yes: {
            label: localizeRemove('remove'),
            icon: '<i class="fas fa-trash"></i>',
            callback: html =>
                html
                    .find('input[name="actor"]:checked')
                    .toArray()
                    .map(x => game.actors.get(x.value))
                    .filter(x => x),
        },
        no: {
            label: localizeRemove('cancel'),
            icon: '<i class="fas fa-times"></i>',
            callback: () => [],
        },
    }

    const data = {
        content: await renderTemplate(template, {
            actors: game.actors.filter(x => x.type === 'character'),
            i18n: localizeRemove,
        }),
        title: localizeRemove('title'),
        buttons,
        default: 'yes',
        render: html => {
            html.on('change', 'input[name="all"]', () => removeActionsToggleAll(html))
            html.on('change', 'input[name="actor"]', () => removeActionsToggleActor(html))
        },
        close: () => [],
    }

    const actors = await Dialog.wait(data, undefined, { id: 'pf2e-hero-actions-remove-actions' })
    if (!actors.length) {
        return warn('templates.removeActions.noSelection')
    }

    for (const actor of actors) {
        await setFlag(actor, 'heroActions', [])
    }

    info('templates.removeActions.removed')
}

function removeActionsToggleAll(html) {
    const state = html.find('input[name="all"]')[0].checked
    html.find('input[name="actor"]').prop('checked', state)
}

function removeActionsToggleActor(html) {
    const actors = html.find('input[name="actor"]')
    const checked = actors.filter(':checked')
    const all = html.find('input[name="all"]')

    if (actors.length === checked.length) {
        all.prop('checked', true).prop('indeterminate', false)
        actors.prop('checked', true)
    } else if (!checked.length) {
        all.prop('checked', false).prop('indeterminate', false)
        actors.prop('checked', false)
    } else {
        all.prop('checked', false).prop('indeterminate', true)
    }
}

async function createDefaultTable(unique) {
    let table = await getDefaultWorldTable()

    if (table) {
        const override = await Dialog.confirm({
            title: localizeDefaultConfirm('title'),
            content: localizeDefaultConfirm('content'),
        })

        if (override) {
            const update = getTableSource(unique)
            await table.update(update)
            return setTable(table, true)
        }
    }

    table = await createDefautActionsTable(unique)
    await setTable(table)
}

async function createCustomTable(unique) {
    const table = await createCustomActionsTable(unique)
    await setTable(table)
    table.sheet?.render(true)
}

async function setTable(table, normalize = false) {
    if (normalize) await table.normalize()
    await setSetting('tableUUID', table.uuid)
}

function getTableSource(unique = true, table) {
    const source = {
        name: localize('table.name'),
        replacement: !unique,
        img: ICON,
        description: localize('table.description'),
        flags: {
            core: {
                sourceId: TABLE_UUID,
            },
        },
    }
    if (!table) return source
    return mergeObject(deepClone(table._source), source)
}

async function createDefautActionsTable(unique = true) {
    const table = await fromUuid(TABLE_UUID)
    const source = getTableSource(unique, table)
    return RollTable.create(source, { temporary: false })
}

function createCustomActionsTable(unique = true) {
    const source = getTableSource(unique)
    return RollTable.create(source, { temporary: false })
}
