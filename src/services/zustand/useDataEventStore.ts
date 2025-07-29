import { NDKEvent } from "@nostr-dev-kit/ndk-mobile"
import { create } from "zustand"

interface DataEvent {
    [key: string]: NDKEvent
}

export interface DataEventStore {
    dataEvents: DataEvent
    addEventData: (key: string, event: NDKEvent) => void
    getEventData: (key: string) => NDKEvent | undefined
    getAllEvents: () => DataEvent
    clearEvents: () => void
}

const useDataEventStore = create<DataEventStore>((set, get) => ({
    dataEvents: {},
    addEventData: (key, event) => {
        set((state) => ({
            dataEvents: {
                ...state.dataEvents,
                [key]: event,
            },
        }))
    },
    getEventData: (key) => {
        return get().dataEvents[key]
    },
    getAllEvents: () => {
        return get().dataEvents
    },
    clearEvents: () => set({ dataEvents: {} }),
}))

export default useDataEventStore
