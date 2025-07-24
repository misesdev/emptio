import { Language, TranslateWords } from "./types"
import { LanguageStorage } from "@storage/language/LanguageStorage";
import { AppSettingsStorage } from "@storage/settings/AppSettingsStorage";
import { AppSettings } from "@storage/settings/types";
import { ITranslateService } from "./ITranslateService";
import pt from "./languages/pt"
import en from "./languages/en"

export class TranslateService implements ITranslateService
{
    private _settings: AppSettings|null;
    private readonly _languageStorage: LanguageStorage;
    private readonly _settingsStorage: AppSettingsStorage;
    private _languages: any = { pt, en }
    
    constructor(
        storage: LanguageStorage = new LanguageStorage(),
        settingsStorage: AppSettingsStorage = new AppSettingsStorage(),
        settings: AppSettings|null = null
    ) {
        this._languageStorage = storage 
        this._settingsStorage = settingsStorage
        this._settings = settings
    }

    public async translate(key: TranslateWords): Promise<string> {
        if(this._settings) 
            return this._languages[this._settings.language.selector][key]
       
        this._settings = await this._settingsStorage.get()
        return this._languages[
            (this._settings as AppSettings).language.selector
        ][key]
    }

    public async getLanguage(): Promise<Language> {
        if(this._settings) 
            return this._settings.language
        this._settings = await this._settingsStorage.get()
        return (this._settings as AppSettings).language

    }

    public async setLanguage(language: Language): Promise<void> {
        const settings = await this._settingsStorage.get()
        if(settings) {
            settings.language = language
            await this.save(settings) 
        }
    }

    public async listLanguages(): Promise<Language[]> {
        const languages = await this._languageStorage.listEntities()
        return languages
    }

    private async save(settings: AppSettings): Promise<void> {
        await this._settingsStorage.set(settings)
    }
}

export const useTranslate = async (key: TranslateWords): Promise<string> => {
    const service = new TranslateService()
    return service.translate(key) 
}
