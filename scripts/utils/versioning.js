import { Update } from '../apps/update.js'
import { getCurrentModule, getSetting, hasLocalize, info, localize, setSetting, warn } from './foundry.js'

/**
 * Requires in `lang/en.json`
 *
 *     "migrate": {
 *          "start": "'{module}' module is checking the world's data, please do not close or refresh the tab/browser.",
 *          "end": "'{module}' module is now done with the data checking.",
 *          "updated": "'{module}' is done migrating to version {version}"
 *      }
 *
 * @param {VersioningMigration[]} migrations
 * @param {Function} [callback] called only on new install
 */
export async function versioning(migrations, callback) {
    const module = getCurrentModule()
    const version = module.version
    const title = module.title
    let lastVersion = getSetting('version')

    if (!isNewerVersion(version, lastVersion)) return
    setSetting('version', version)

    warn('migrate.start', { module: title }, true)

    let notify = () => info('migrate.end', { module: title }, true)
    const migrated = () => info('migrate.updated', { version, module: title }, true)

    const news = []

    for (const migration of migrations) {
        const hasMigrated = await migration.migrate()
        if (!hasMigrated) break
        if (migration.news) {
            news.push({ version: migration.version, content: migration.news() })
        }
        notify = migrated
    }

    if (news.length) {
        new Update(news.reverse()).render(true)
    } else if (callback && notify !== migrated) {
        callback()
    }

    notify()
}
