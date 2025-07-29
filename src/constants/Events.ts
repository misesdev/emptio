
export const Events = {
    MetadataEvent: {
        kind: 0,
    },
    TextNoteEvent: {
        kind: 1
    },
    MessageEvent: {
        kind: 4
    },
    MaxListener: 20,
    TimeOut: 5000,
}

export const EventKinds = {
    metadata: 0,
    note: 1,
    followList: 3,
    privateChat: 4,
    delete: 5,
    repost: 6,
    reaction: 7,
    relayList: 10002,
    chatRelayList: 10050,
    classifiedListening: 30402,
    zap: 9734,    
}

export const jsonContentKinds = [
    EventKinds.metadata
]


