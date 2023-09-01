import { getHeroActions } from '../actions'
import { error, getCharacterOwner, getOwner, localize, subLocalize, templatePath, warn } from '../module'
import { sendTradeRequest } from '../trade'

export class Trade extends Application {
    constructor(actor) {
        super({ id: `pf2e-hero-actions-trade-${actor.id}` })
        this._actor = actor
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: localize('templates.trade.title'),
            template: templatePath('trade.hbs'),
            width: 600,
            height: 'auto',
        })
    }

    get actor() {
        return this._actor
    }

    get target() {
        return this._target
    }

    set target(value) {
        if (!value) {
            error('templates.trade.no-target')
            return
        }
        if (value === this._target) return
        delete this.target?.apps?.[this.appId]
        this._target = value
        this.render()
    }

    getData(options) {
        return mergeObject(super.getData(), {
            actor: this.actor,
            target: this.target,
            targets: game.actors.filter(x => x.type === 'character' && x.id !== this.actor.id && x.hasPlayerOwner),
            actions: getHeroActions(this.actor),
            targetActions: this.target ? getHeroActions(this.target) : [],
            i18n: subLocalize('templates.trade'),
        })
    }

    activateListeners(html) {
        super.activateListeners(html)
        html.find('select[name="target"]').on('change', this.#onChangeTarget.bind(this))
        html.find('[data-action="description"]').on('click', this.#onDescription.bind(this))
        html.find('[data-action="trade"]').on('click', this.#onSendTrade.bind(this))
        html.find('[data-action="cancel"]').on('click', () => this.close())
    }

    render(force, options) {
        this.actor.apps[this.appId] = this
        if (this.target) this.target.apps[this.appId] = this
        return super.render(force, options)
    }

    async close(options) {
        await super.close(options)
        delete this.actor.apps?.[this.appId]
        delete this.target?.apps?.[this.appId]
    }

    #onSendTrade() {
        if (!this.target) {
            warn('templates.trade.no-target')
            return
        }

        const action = this.element.find('[name="action"]:checked').val()
        const target = this.element.find('[name="targetAction"]:checked').val()

        if (typeof action !== 'string' || typeof target !== 'string') {
            warn('templates.trade.no-select')
            return
        }

        let user = getCharacterOwner(this.target, true) ?? getOwner(this.target, true) ?? game.users.activeGM
        if (!user) {
            warn('templates.trade.no-user')
            return
        }

        sendTradeRequest({
            sender: {
                id: game.user.id,
                cid: this.actor.id,
                uuid: action,
            },
            receiver: {
                id: user.id,
                cid: this.target.id,
                uuid: target,
            },
        })

        this.close()
    }

    async #onDescription(event) {
        const uuid = $(event.currentTarget).siblings('input').val()
        const entry = await fromUuid(uuid)
        entry?.sheet.render(true)
    }

    #onChangeTarget(event) {
        const id = event.currentTarget.value
        this.target = game.actors.get(id)
    }
}
