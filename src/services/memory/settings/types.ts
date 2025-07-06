import { Currency } from "@src/constants/Currencies"

export interface VideoSettings {
    VIDEOS_LIMIT: number,
    FETCH_LIMIT: number,
    filterTags: string[],
}

export type Settings = {
    useBiometrics?: boolean,
    currency?: Currency
}
