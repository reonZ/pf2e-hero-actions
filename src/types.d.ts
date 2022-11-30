declare interface HeroAction {
    uuid: string
    name: string
}

declare interface BaseTrade {
    sender: {
        id: string
        cid: string
        uuid: string
    }
    receiver: {
        id: string
        cid: string
        uuid: string
    }
}

declare type TradeRequestPacket = BaseTrade & {
    type: 'trade-request'
}

declare type TradeAcceptPacket = BaseTrade & {
    type: 'trade-accept'
}

declare type TradeRejectPacket = BaseTrade & {
    type: 'trade-reject'
}

declare type TradeError = 'trade-error'

declare type TradeErrorPacket = {
    type: 'trade-error'
    users: string[]
    error: TradeError
}

declare type Packet = TradeRequestPacket | TradeAcceptPacket | TradeRejectPacket | TradeErrorPacket
