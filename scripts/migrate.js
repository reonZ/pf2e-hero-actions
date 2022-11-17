import { CREATE_TABLE_UUID } from './helpers.js'
import { getDefaultCompendiumTable, getHeroActions, setHeroActions } from './hero-actions.js'
import { documentUuidFromTableResult, getFlag, hasModuleFlag, localize } from './utils/foundry.js'

/** @type {VersioningMigration[]} */
export const migrations = [
    {
        version: '2.0.0',
        migrate: async () => {
            const table = (await getDefaultCompendiumTable()).results
            const actors = /** @type {ActorsPF2e} */ (game.actors)

            let hasMigrated = false

            for (const actor of actors) {
                if (!actor.isOfType('character') || !hasModuleFlag(actor)) continue

                const actions = /** @type {Array<string | HeroAction> | undefined} */ (getFlag(actor, 'heroActions'))

                if (Array.isArray(actions)) hasMigrated = true
                else continue

                const newActions = actions.reduce((actions, action) => {
                    if (typeof action !== 'string') {
                        actions.push(action)
                        return actions
                    }

                    const entry = table.find(x => x.documentId === action)
                    if (!entry) return actions

                    const uuid = documentUuidFromTableResult(entry)
                    if (!uuid) return actions

                    actions.push({ uuid, name: entry.text })
                    return actions
                }, /** @type {HeroAction[]} */ ([]))

                await setHeroActions(actor, newActions)
                console.log(`[PF2e Hero Actions] actor (${actor.id}) migration`, newActions)
            }

            return hasMigrated
        },
        news: () => localize('migrations.200', { UUID: CREATE_TABLE_UUID }),
    },
]
