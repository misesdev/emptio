import { Language, TranslateWords } from "./types";

export interface ITranslateService {
    getLanguage(): Promise<Language>;
    listLanguages(): Promise<Language[]>;
    setLanguage(language: Language): Promise<void>;
    translate(language: Language, key: TranslateWords): string;
}
