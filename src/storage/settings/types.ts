import { Language } from "@/src/services/translate/types"
import { Currency } from "@src/constants/Currencies"

export type AppSettings = {
    useBiometrics: boolean,
    language: Language,
    currency: Currency
}
