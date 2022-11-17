import { getCurrentModule, localize, templatePath } from '../utils/foundry.js'

export class Update extends Application {
    /** @param {{version: string, content: string}[]} news */
    constructor(news) {
        super()
        this._news = news
    }

    /** @returns {ApplicationOptions} */
    static get defaultOptions() {
        return {
            ...super.defaultOptions,
            id: 'pf2e-hero-actions-updates',
            title: localize('templates.update.title'),
            template: templatePath('update.html'),
            minimizable: false,
            width: 600,
        }
    }

    async getData() {
        const news = []
        for (const update of this._news) {
            news.push({
                version: update.version,
                content: await TextEditor.enrichHTML(update.content, { async: true }),
            })
        }

        return {
            news,
            module: getCurrentModule().title,
        }
    }
}
