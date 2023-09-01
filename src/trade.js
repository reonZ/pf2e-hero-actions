import { chatUUID, error, getFlag, localize, setFlag, socketEmit, warn } from './module'

export async function onTradeRequest(trade) {
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

export async function onTradeAccepted(trade) {
    const { sender, receiver } = trade
    const senderActor = game.actors.get(sender.cid)
    const receiverActor = game.actors.get(receiver.cid)

    if (!senderActor || !receiverActor) {
        sendTradeError(trade)
        return
    }

    const senderActions = getFlag(senderActor, 'heroActions') ?? []
    const receiverActions = getFlag(receiverActor, 'heroActions') ?? []

    const senderActionIndex = senderActions.findIndex(x => x.uuid === sender.uuid)
    const receiverActionIndex = receiverActions.findIndex(x => x.uuid === receiver.uuid)

    if (senderActionIndex === -1 || receiverActionIndex === -1) {
        sendTradeError(trade)
        return
    }

    const senderAction = senderActions.splice(senderActionIndex, 1)[0]
    const receiverAction = receiverActions.splice(receiverActionIndex, 1)[0]

    senderActions.push(receiverAction)
    receiverActions.push(senderAction)

    setFlag(senderActor, 'heroActions', senderActions)
    setFlag(receiverActor, 'heroActions', receiverActions)

    const sentLink = chatUUID(senderAction.uuid)
    const receivedLink = chatUUID(receiverAction.uuid)

    let content = `<div style="line-height: 1.6">${localize('trade-success.offer', { offer: sentLink })}</div>`
    content += `<div style="line-height: 1.6">${localize('trade-success.receive', { receive: receivedLink })}</div>`

    ChatMessage.create({
        flavor: `<h4 class="action">${localize('trade-success.header', { name: receiverActor.name })}</h4>`,
        content,
        speaker: ChatMessage.getSpeaker({ actor: senderActor }),
    })
}

export function onTradeError(err) {
    error('trade-error')
}

export async function onTradeRejected({ receiver }) {
    const actor = game.actors.get(receiver.cid)
    warn('trade-rejected', { name: actor.name }, true)
}

export function sendTradeRequest(trade) {
    if (trade.receiver.id === game.user.id) {
        acceptRequest(trade)
        return
    }

    socketEmit({
        ...trade,
        type: 'trade-request',
    })
}

function acceptRequest(trade) {
    if (game.user.isGM) {
        onTradeAccepted(trade)
        return
    }

    socketEmit({
        ...trade,
        type: 'trade-accept',
    })
}

function rejectRequest(trade) {
    if (trade.sender.id === game.user.id) {
        onTradeRejected(trade)
        return
    }

    socketEmit({
        ...trade,
        type: 'trade-reject',
    })
}

function sendTradeError({ sender, receiver }, error = 'trade-error') {
    const users = new Set([sender.id, receiver.id])

    if (users.has(game.user.id)) {
        users.delete(game.user.id)
        onTradeError(error)
    }

    if (!users.size) return

    socketEmit({
        type: 'trade-error',
        users: Array.from(users),
        error,
    })
}
