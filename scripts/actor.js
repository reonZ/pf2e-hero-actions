import { getHeroDeckPack } from './hero-actions.js'
import { getFlag } from './utils/foundry.js'

/** @param {ActorPF2e} actor */
export function getHeroActionsIndexes(actor) {
    const indexes = getHeroDeckPack().index
    const actions = /** @type {string[]} */ (getFlag(actor, 'heroActions') ?? [])
    return /** @type {{ _id: string; name: string;}[]} */ (
        actions.filter(action => indexes.has(action)).map(action => indexes.get(action))
    )
}
