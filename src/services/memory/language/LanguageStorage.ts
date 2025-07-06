import { Language } from "../../translate/types";
import { BaseStorage } from "../base/BaseStorage";
import { StoredItem } from "../types";

export class LanguageStorage extends BaseStorage<Language>
{
    private readonly _defaults: Language[]

    constructor() {
        super("language")
        super.notFoundMessage = "Language not found"
        this._defaults = [
            { label: "English", selector: "en" },
            { label: "Portuguese", selector: "pt" }
        ]
    }

    public async list(): Promise<StoredItem<Language>[]> {
        const list = await super.list()
        if(!list.length)
            return this._defaults.map((entity, id) : StoredItem<Language> => {
                return { id, entity }
            })
        return list
    }

    public async listEntities(): Promise<Language[]> {
        const list = await super.list()
        if(!list.length)
            return this._defaults
        return list.map(item => item.entity)
    }
}

