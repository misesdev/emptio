import { Language } from "@services/translate/types";
import { BaseStorage } from "../base/BaseStorage";

export class LanguageStorage extends BaseStorage<Language>
{
    constructor() {
        super("language", [
            { label: "English", selector: "en" },
            { label: "Portuguese", selector: "pt" }
        ])
        super.notFoundMessage = "Language not found"
    }
}

