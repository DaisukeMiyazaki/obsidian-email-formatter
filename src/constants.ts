import {
    CommandType,
    LlmProviderType,
    SimplePromptPluginSettings,
} from "./types";

// PROMPTS

export const DEFAULT_FORMATT_EMAIL_TEMPLATE = `
You are a helpful AI assistant that can, given a piece of text and a request, generate an answer using markdown.
Add the necessary starting and closing lines to make the email sound polite.
Leave the receiever's name and the sender's name as XXX. 
Please translate the text to <LANGUAGE>.

Example:
====================================

Text:
- お誘いありがたい
- 仕事が忙しい
- 申し訳ない

Email:
XXX 様

いつもお世話になっております。

お誘いいただきありがとうございます。
ぜひ参加させていただきたいのですが生憎仕事の予定が入ってしまっており、参加できそうにありません。
またの機会にお誘いいただけると幸いです。

以上、よろしくお願いいたします。
====================================    

Text: 
<BULLETPOINTS>

Email: `;

// PROMPT COMMANDS
export const FORMATT_EMAIL_COMMAND_NAME = "Format email";

export const FORMATT_EMAIL_COMMAND_SUBTITLE =
    "Nicely Format your email content given a set of bulletpoints.";

export const PROMPT_COMMANDS: {
    name: string;
    id: string;
    type: CommandType;
}[] = [
    {
        name: FORMATT_EMAIL_COMMAND_NAME,
        id: "prompt-format-email",
        type: "email"
    }
];

// SETTINGS
export const DEFAULT_SETTINGS: SimplePromptPluginSettings = {
    settingsVersion: 1,
    provider: "openai",
    apiKey: {
        openai: null,
    },
    model: {
        openai: "gpt-3.5-turbo",
        ollama: "llama3",
    },
    recentPrompts: [],
    recentsLimit: 5,
    recentPromptsEnabled: true,
    promptTemplates: {
        email: DEFAULT_FORMATT_EMAIL_TEMPLATE
    },
    streaming: false,
    language: "Japanese"
};

// SETTINGS
export const SETTINGS_TOGGLE_STREAMING_COMMAND_NAME = "Toggle streaming";
export const SETTINGS_TOGGLE_RECENT_PROMPTS_COMMAND_NAME =
    "Toggle Enable/Disable Recent Prompts";

export const API_KEY_PROVIDERS: LlmProviderType[] = ["openai"];
