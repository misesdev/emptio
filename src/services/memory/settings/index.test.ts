import AsyncStorage from "@react-native-async-storage/async-storage"
import { SettingsStorage } from "./index"
import { FeedVideosSettings, Settings } from "../types"

jest.mock("@react-native-async-storage/async-storage")

describe("SettingsStorage", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe("get", () => {
        it("returns default settings if none are stored", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

            const settings = await SettingsStorage.get()
            expect(settings).toEqual({ useBiometrics: false })
        })

        it("returns parsed settings from AsyncStorage", async () => {
            const mockSettings = { useBiometrics: true }
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSettings))

            const settings = await SettingsStorage.get()
            expect(settings).toEqual(mockSettings)
        })
    })

    describe("save", () => {
        it("saves settings to AsyncStorage", async () => {
            const newSettings: Settings = { useBiometrics: true }

            await SettingsStorage.save(newSettings)

            expect(AsyncStorage.setItem).toHaveBeenCalledWith("settings", JSON.stringify(newSettings))
        })
    })

    describe("feedVideos.get", () => {
        it("returns default feed video settings if none are stored", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

            const result = await SettingsStorage.feedVideos.get()

            expect(result).toEqual(SettingsStorage["defaultFeedSettings"])
        })

        it("returns stored feed video settings", async () => {
            const storedSettings: FeedVideosSettings = {
                FETCH_LIMIT: 200,
                VIDEOS_LIMIT: 20,
                filterTags: ["video"]
            }

            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(storedSettings))

            const result = await SettingsStorage.feedVideos.get()

            expect(result).toEqual(storedSettings)
        })
    })

    describe("feedVideos.save", () => {
        it("saves feed video settings", async () => {
            const settings: FeedVideosSettings = {
                FETCH_LIMIT: 300,
                VIDEOS_LIMIT: 10,
                filterTags: ["meme"]
            }

            await SettingsStorage.feedVideos.save(settings)

            expect(AsyncStorage.setItem).toHaveBeenCalledWith("feed-videos-settings", JSON.stringify(settings))
        })
    })

    describe("blackList.get", () => {
        it("returns default blacklist if none are stored", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

            const result = await SettingsStorage.blackList.get()

            expect(result).toEqual(new Set(SettingsStorage["defaultBlackList"]))
        })

        it("returns stored blacklist as Set", async () => {
            const stored = [
                "abc123", "def456"
            ]
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(stored))

            const result = await SettingsStorage.blackList.get()

            expect(result).toEqual(new Set(stored))
        })
    })

    describe("blackList.add", () => {
        it("adds a pubkey to existing blacklist", async () => {
            const existing = ["abc"]
            ;(AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(existing))

            await SettingsStorage.blackList.add("newkey")

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "black-list-pubkeys",
                JSON.stringify([...existing, "newkey"])
            )
        })

        it("adds pubkey to default list if none stored", async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null)

            const newKey = "new-key"
            await SettingsStorage.blackList.add(newKey)

            const expected = [...SettingsStorage["defaultBlackList"]]

            expect(AsyncStorage.setItem).toHaveBeenCalledWith(
                "black-list-pubkeys",
                JSON.stringify(expected)
            )
        })
    })
})
