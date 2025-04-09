import AsyncStorage from "@react-native-async-storage/async-storage"
import { LanguageStorage } from "./index"
import { Language } from "@services/translate/types"

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn()
}))

describe("LanguageStorage", () => {
  const defaultLanguage: Language = { label: "English", selector: "en" }
  const portuguese: Language = { label: "Portuguese", selector: "pt" }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("get", () => {
    it("should return the default language if no language is stored", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null)

      const language = await LanguageStorage.get()

      expect(language).toEqual(defaultLanguage)
      expect(AsyncStorage.getItem).toHaveBeenCalledWith("language")
    })

    it("should return the stored language if it exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(portuguese))

      const language = await LanguageStorage.get()

      expect(language).toEqual(portuguese)
    })
  })

  describe("list", () => {
    it("should return the list of available languages", () => {
      const list = LanguageStorage.list()

      expect(list).toContainEqual(defaultLanguage)
      expect(list).toContainEqual(portuguese)
    })
  })

  describe("save", () => {
    it("should save the selected language to AsyncStorage", async () => {
      await LanguageStorage.save(portuguese)

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "language",
        JSON.stringify(portuguese)
      )
    })
  })
})
