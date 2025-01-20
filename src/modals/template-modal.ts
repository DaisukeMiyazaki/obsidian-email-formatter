import { Modal } from "obsidian";
import {
    FORMATT_EMAIL_COMMAND_NAME
} from "src/constants";
import SimplePromptPlugin from "src/main";
import { CommandType } from "src/types";
import { notice } from "src/utils";

export default class TemplateModal extends Modal {
    plugin: SimplePromptPlugin;
    type: CommandType;
    constructor(plugin: SimplePromptPlugin, type: CommandType) {
        super(plugin.app);
        this.plugin = plugin;
        this.type = type;
    }

    onOpen() {
        const { contentEl } = this;
        const wrapper = contentEl.createEl("div");
        wrapper.addClasses([
            "pr-flex",
            "pr-flex-col",
            "pr-p-5",
            "pr-gap-5",
            "pr-justify-center",
            "pr-items-center",
        ]);

        const title = wrapper.createEl("h3", {
            text: `Edit "${this.getTitle()}" prompt`,
        });
        title.addClasses(["pr-text-lg", "pr-font-semibold", "pr-mb-5"]);

        const desc = wrapper.createEl("p", {
            text: `Define the prompt templates used for generating content.
            
            Don't delete the placeholders like <BULLETPOINTS>, <LANGUAGE> etc.
           `,
        });
        desc.addClasses(["pr-text-xs", "pr-mb-5", "pr-text-slate-400"]);

        const input = wrapper.createEl("textarea", {
            text: this.plugin.settings.promptTemplates[this.type] ?? "",
        });

        input.addClasses([
            "pr-p-2",
            "pr-border",
            "pr-rounded-md",
            "pr-w-full",
            "pr-min-h-56",
        ]);

        const button = wrapper.createEl("button", { text: "Submit" });
        button.addEventListener("click", async () => {
            if (!this.validateTemplate(input.value)) {
                return;
            }
            this.plugin.settings.promptTemplates[this.type] = input.value;
            await this.plugin.saveSettings();
            notice("Template successfully changed!");
            this.close();
        });
        button.addClasses(["pr-p-5"]);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    getTitle() {
        switch (this.type) {
            case "email":
                return FORMATT_EMAIL_COMMAND_NAME;
        }
    }

    validateTemplate(value: string): boolean {
        switch (this.type) {
            case "email":
                if (
                    !value.includes("<BULLETPOINTS>") ||
                    !value.includes("<LANGUAGE>")
                ) {
                    const errorMsg =
                        "Email prompt template must include <BULLETPOINTS> and <LANGUAGE>";
                    console.error(errorMsg);
                    notice(errorMsg);
                    return false;
                }
                break;
        }
        return true;
    }
}
