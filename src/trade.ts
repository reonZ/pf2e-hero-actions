import { getFlag, setFlag } from '@utils/foundry/flags'
import { localize } from '@utils/foundry/localize'
import { error, warn } from '@utils/foundry/notification'
import { chatUUID } from '@utils/foundry/uuid'
import { socketEmit } from '@utils/socket'

export async function onTradeRequest(trade: BaseTrade) {
    const { sender, receiver } = trade
    const senderActor = game.actors.get(sender.cid)
    const receiverActor = game.actors.get(receiver.cid)

    if (!senderActor || !receiverActor) {
        sendTradeError(trade)
        return
    }

    let content = `<p>${localize('trade-request.header', { sender: senderActor.name, receiver: receiverActor.name })}</p>`
    content += `<p>${localize('trade-request.give', { give: chatUUID(sender.uuid) })}</p>`
    content += `<p>${localize('trade-request.want', { want: chatUUID(receiver.uuid) })}</p>`
    content += `<p style="margin-bottom: 1em;">${localize('trade-request.accept')}</p>`

    const accept = await Dialog.confirm({
        title: localize('trade-request.title'),
        content: await TextEditor.enrichHTML(content, { async: true }),
    })

    if (accept) acceptRequest(trade)
    else rejectRequest(trade)
}

export async function onTradeAccepted(trade: BaseTrade) {
    const { sender, receiver } = trade
    const senderActor = game.actors.get(sender.cid)
    const receiverActor = game.actors.get(receiver.cid)

    if (!senderActor || !receiverActor) {
        sendTradeError(trade)
        return
    }

    const senderActions = getFlag<HeroAction[]>(senderActor, 'heroActions') ?? []
    const receiverActions = getFlag<HeroAction[]>(receiverActor, 'heroActions') ?? []

    const senderActionIndex = senderActions.findIndex(x => x.uuid === sender.uuid)
    const receiverActionIndex = receiverActions.findIndex(x => x.uuid === receiver.uuid)

    if (senderActionIndex === -1 || receiverActionIndex === -1) {
        sendTradeError(trade)
        return
    }

    const senderAction = senderActions.splice(senderActionIndex, 1)[0]!
    const receiverAction = receiverActions.splice(receiverActionIndex, 1)[0]!

    senderActions.push(receiverAction)
    receiverActions.push(senderAction)

    setFlag(senderActor, 'heroActions', senderActions)
    setFlag(receiverActor, 'heroActions', receiverActions)

    let content = `<div>${localize('trade-success.offer', { offer: chatUUID(senderAction.uuid) })}</div>`
    content += `<div>${localize('trade-success.receive', { receive: chatUUID(receiverAction.uuid) })}</div>`

    ChatMessage.create({
        flavor: `<h4 class="action">${localize('trade-success.header', { name: receiverActor.name })}</h4>`,
        content,
        speaker: ChatMessage.getSpeaker({ actor: senderActor }),
    })
}

export async function onTradeRejected({ receiver }: BaseTrade) {
    const actor = game.actors.get(receiver.cid)!
    warn('trade-rejected', { name: actor.name }, true)
}

export function onTradeError(err: string) {
    error('trade-error')
}

export function sendTradeRequest(trade: BaseTrade) {
    if (trade.receiver.id === game.user.id) {
        acceptRequest(trade)
        return
    }

    socketEmit<TradeRequestPacket>({
        ...trade,
        type: 'trade-request',
    })
}

function rejectRequest(trade: BaseTrade) {
    if (trade.sender.id === game.user.id) {
        onTradeRejected(trade)
        return
    }

    socketEmit<TradeRejectPacket>({
        ...trade,
        type: 'trade-reject',
    })
}

function acceptRequest(trade: BaseTrade) {
    if (game.user.isGM) {
        onTradeAccepted(trade)
        return
    }

    socketEmit<TradeAcceptPacket>({
        ...trade,
        type: 'trade-accept',
    })
}

function sendTradeError({ sender, receiver }: BaseTrade, error: TradeError = 'trade-error') {
    const users = new Set([sender.id, receiver.id])

    if (users.has(game.user.id)) {
        users.delete(game.user.id)
        onTradeError(error)
    }

    if (!users.size) return

    socketEmit<TradeErrorPacket>({
        type: 'trade-error',
        users: Array.from(users),
        error,
    })
}
