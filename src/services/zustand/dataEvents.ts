import { NostrEvent } from "@nostr-dev-kit/ndk-mobile"
import { create } from "zustand"

interface DataEvent {
    [key: string]: NostrEvent
}

interface DataEventStore {
    dataEvents: DataEvent
    addEventData: (key: string, event: NostrEvent) => void
    getEventData: (key: string) => NostrEvent | undefined
    getAllEvents: () => DataEvent
    clearEvents: () => void
}

const useDataEventStore = create<DataEventStore>((set, get) => ({
    dataEvents: {},
    addEventData: (key, event) =>
        set((state) => ({
            dataEvents: {
                ...state.dataEvents,
                [key]: event,
            },
        })),
    getEventData: (key) => {
        return get().dataEvents[key]
    },
    getAllEvents: () => {
        return get().dataEvents
    },
    clearEvents: () => set({ dataEvents: {} }),
}))

export default useDataEventStore
