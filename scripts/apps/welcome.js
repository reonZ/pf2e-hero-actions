import { CREATE_TABLE_UUID } from '../helpers.js'
import { getCurrentModule, localize, templatePath } from '../utils/foundry.js'

export class Welcome extends Application {
    /** @returns {ApplicationOptions} */
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: 'pf2e-hero-actions-welcome',
            title: localize('welcome.title'),
            template: templatePath('welcome.html'),
            minimizable: false,
            width: 600,
        }
    }

    async getData() {
        const content = localize('welcome.content', { UUID: CREATE_TABLE_UUID })

        return {
            module: getCurrentModule().title,
            content: await TextEditor.enrichHTML(content, { async: true }),
        }
    }
}
