import useDataEventStore from "./dataEvents"
import { NostrEvent } from "@nostr-dev-kit/ndk-mobile"

const mockEvent = {
    id: "123",
    pubkey: "abc",
    content: "follows",
    created_at: 1234567890,
    kind: 1,
    sig: "signature",
    tags: [],
} as NostrEvent 

const anotherMockEvent = {
    id: "456",
    pubkey: "def",
    content: "metadata",
    created_at: 9876543210,
    kind: 0,
    sig: "signature2",
    tags: [],
} as NostrEvent

describe("useDataEventStore", () => {

    beforeEach(() => {
        // Reset store state before each test
        useDataEventStore.getState().clearEvents()
    })

    it("should initialize with empty dataEvents", () => {
        const events = useDataEventStore.getState().getAllEvents()
        expect(events).toEqual({})
    })

    it("should add an event with addEventData", () => {
        useDataEventStore.getState().addEventData("follows", mockEvent)

        const stored = useDataEventStore.getState().getEventData("follows")
        expect(stored).toEqual(mockEvent)
    })

    it("should overwrite an event with same key", () => {
        useDataEventStore.getState().addEventData("follows", mockEvent)
        useDataEventStore.getState().addEventData("follows", anotherMockEvent)

        const stored = useDataEventStore.getState().getEventData("follows")
        expect(stored).toEqual(anotherMockEvent)
    })

    it("should retrieve all events", () => {
        useDataEventStore.getState().addEventData("follows", mockEvent)
        useDataEventStore.getState().addEventData("profile", anotherMockEvent)

        const all = useDataEventStore.getState().getAllEvents()
        expect(Object.keys(all)).toHaveLength(2)
        expect(all["follows"]).toEqual(mockEvent)
        expect(all["profile"]).toEqual(anotherMockEvent)
    })

    it("should return undefined if key does not exist", () => {
        const result = useDataEventStore.getState().getEventData("nonexistent")
        expect(result).toBeUndefined()
    })

    it("should clear all events", () => {
        useDataEventStore.getState().addEventData("follows", mockEvent)
        useDataEventStore.getState().clearEvents()

        const all = useDataEventStore.getState().getAllEvents()
        expect(all).toEqual({})
    })
})
