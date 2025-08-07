import { Language } from "@services/translate/types"
import { Currency } from "@src/constants/Currencies"
import { UploadServer } from "../servers/types";

export type AppSettings = {
    useBiometrics: boolean;
    language: Language;
    uploadServer: UploadServer;
    currency: Currency;
}
