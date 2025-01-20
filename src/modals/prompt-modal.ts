// currently this template is not used in the plugin
import { Editor, Modal, Setting } from "obsidian";
import SimplePromptPlugin from "src/main";
import { notice } from "src/utils";
import {
    FORMATT_EMAIL_COMMAND_NAME,
    FORMATT_EMAIL_COMMAND_SUBTITLE

} from "../constants";
import { CommandType } from "../types";

export default class PromptModal extends Modal {
    editor: Editor;
    plugin: SimplePromptPlugin;
    type: CommandType;
    constructor(
        plugin: SimplePromptPlugin,
        editor: Editor,
        type?: CommandType,
    ) {
        super(plugin.app);
        this.editor = editor;
        this.plugin = plugin;
        this.type = type ?? "email";
    }

    onOpen() {
        if (
            this.plugin.settings.provider === "openai" &&
            this.plugin.settings.apiKey.openai == null
        ) {
            notice(
                "Missing API key. Please enter your API key in the settings",
            );
            this.close();
            return;
        }
        const { contentEl, modalEl } = this;
        modalEl.addClasses(["pr-w-1/2"]);
        const wrapper = contentEl.createEl("div");
        wrapper.addClasses(["pr-flex", "pr-flex-col", "pr-p-5"]);

        const title = wrapper.createEl("span", { text: this.getTitle() });
        title.addClasses(["pr-text-lg", "pr-font-semibold"]);

        const subtitle = wrapper.createEl("span", { text: this.getSubtitle() });
        subtitle.addClasses([
            "pr-text-sm",
            "pr-font-normal",
            "pr-mb-10",
            "pr-opacity-50",
        ]);


        const { textarea } = this.buildPromptFields(wrapper);

        textarea.focus();

        const button = wrapper.createEl("button", { text: "Generate!" });
        button.addClasses([
            "!pr-bg-emerald-600",
            "pr-text-white",
            "hover:!pr-bg-emerald-700",
            "pr-mt-5",
            "pr-font-semibold",
            "pr-text-base",
        ]);
        button.addEventListener("click", async () => {
            if (textarea.value === "") {
                notice("Please enter a prompt");
                return;
            }
            wrapper.empty();
            const loader = wrapper.createEl("span");
            wrapper.addClasses(["pr-flex", "pr-flex-col", "pr-items-center"]);
            loader.addClasses(["loading", "dots", "pr-text-xl"]);

            this.close();
        });

        button.addClasses(["pr-p-5", "pr-rounded-md", "pr-cursor-pointer"]);

        textarea.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                button.click();
            }
        });
    }

    private getTitle(): string | DocumentFragment | undefined {
        switch (this.type) {
            case "email":
                return FORMATT_EMAIL_COMMAND_NAME;
            default:
                return "Generate content";
        }
    }

    private getSubtitle(): string | DocumentFragment | undefined {
        switch (this.type) {
            case "email":
                return FORMATT_EMAIL_COMMAND_SUBTITLE;
            default:
                return "Generate content";
        }
    }

    private buildPromptFields(wrapper: HTMLDivElement): {
        textarea: HTMLTextAreaElement;
    } {
        const promptWrapper = wrapper.createEl("div");
        promptWrapper.addClasses([
            "pr-w-full",
            "pr-flex",
            "pr-gap-5",
            "pr-mb-5",
        ]);

        const textarea = promptWrapper.createEl("textarea", {
            placeholder: "Write your prompt here",
        });

        textarea.addClasses([
            "pr-p-2",
            "pr-border",
            "pr-rounded-md",
            "pr-w-full",
            "pr-min-h-40",
            "pr-h-auto",
            "pr-resize-none",
            "pr-text-base",
        ]);
        const recentPrompts = this.plugin.settings.recentPrompts;
        if (
            recentPrompts.length === 0 ||
            !this.plugin.settings.recentPromptsEnabled
        ) {
            return { textarea };
        }

        const recentPromptSelector = new Setting(wrapper)
            .setDesc("Recent prompts")
            .addDropdown((dropdown) => {
                let i = 0;
                for (const prompt of this.plugin.settings.recentPrompts) {
                    dropdown.addOption(
                        `${i}`,
                        `${
                            prompt.length > 50
                                ? prompt.substring(0, 50) + "...  "
                                : prompt
                        }`,
                    );
                    const option = dropdown.selectEl.options[i];
                    option.addClasses(["pr-text-xs"]);
                    option.ariaLabel = prompt;
                    i++;
                }
                dropdown.setValue("");
                dropdown.onChange(async (value) => {
                    dropdown.setValue("");
                    textarea.value =
                        this.plugin.settings.recentPrompts[parseInt(value)];
                });
            });
        recentPromptSelector.descEl.addClasses([
            "pr-text-base",
            "pr-font-semibold",
        ]);
        recentPromptSelector.settingEl.addClasses([
            "pr-py-5",
            "pr-border-0",
            "pr-border-y",
            "pr-border-solid",
            "pr-border-y-slate-200",
        ]);
        return { textarea };
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
