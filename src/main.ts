import { Editor, MarkdownView, Plugin } from "obsidian";
import {
    DEFAULT_SETTINGS,
    PROMPT_COMMANDS,
} from "./constants";
import SimplePromptSettingTab from "./settings";
import { SimplePromptPluginSettings } from "./types";
import { notice } from "./utils";
import { generate } from "./llms/generate";

export default class SimplePromptPlugin extends Plugin {
    settings: SimplePromptPluginSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: "prompt-format-email",
            name: "prompt-format-email",
            callback: async () => {
                // call generateForEmail
                const view = this.app.workspace.getActiveViewOfType(MarkdownView);
                if (!view) {
                    return;
                }
                const editor = view.editor;
                const input = editor.getSelection();

                notice("Generating email content...");
                await this.generateForEmail(editor, input);

            }
        }
        )

        this.addSettingTab(new SimplePromptSettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings() {
        const userData = await this.loadData();
        if (userData?.settingsVersion !== DEFAULT_SETTINGS.settingsVersion) {
            console.log(
                "Settings version mismatch, resetting to default. Previous version: ",
                userData,
            );
            this.settings = DEFAULT_SETTINGS;
            this.saveSettings();
            notice(
                "Due to updated version, settings have been reset to default. Please reconfigure API keys in the settings",
            );
        } else {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, userData);
        }

        for (const c of PROMPT_COMMANDS) {
            if (this.settings.promptTemplates[c.type] === undefined) {
                this.settings.promptTemplates[c.type] =
                    DEFAULT_SETTINGS.promptTemplates[c.type];
                this.saveSettings();
            }
        }
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async generateForEmail(editor: Editor, input?: string) {
        const prompt = this.settings.promptTemplates.document
            .replace("<SELECTION>", `${editor.getValue()}`)
            .replace("<REQUEST>", `${input ?? ""}`);

        await generate(this, prompt, (result) => {
            editor.replaceSelection
                ? editor.replaceSelection(result)
                : editor.setValue(result);
            notice("Email content generated successfully");
        });
    }
}
