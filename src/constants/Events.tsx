
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
    MaxListener: 50,
    TimeOut: 5000,
}

export const NostrEventKinds = {
    profile: 0,
    note: 1,
    contactList: 3,
    repost: 6,
    reaction: 7,
}

export default Events

