import { Language } from "@/src/services/translate/types"
import { Currency } from "@src/constants/Currencies"

export interface VideoSettings {
    VIDEOS_LIMIT: number,
    FETCH_LIMIT: number,
    filterTags: string[],
}

export type AppSettings = {
    useBiometrics: boolean,
    language: Language,
    currency: Currency
}
