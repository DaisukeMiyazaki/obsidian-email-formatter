# Simple Email Formatter

# Shout out to its oritinal project
This project is heavily inspired by [
obsidian-simple-prompt-plugin](https://github.com/arumie/obsidian-simple-prompt-plugin) and this codebase is almost identical to the project. Huge thank you to this project and its contributors.

# What is this project
This is a simple email formatter. You write a set of bulletpoints of your email in its simpliest form and this plugin helps it to sound from extremely casual to passible / professional.

# Why this project

Writing email takes some mental space, but for at least my case it does for formalizing it. I can response the gist right away if I can dismiss the formality, so this plugin will come handy to lift some weight on that. Currenlty the prompt is set to Japanse rewriting.


## How to use

-   Clone this repo into your Obsidian vault's plugins folder.
-   `npm i` or `yarn` to install dependencies.
-   `npm run dev` to start compilation in watch mode.
-   `npm run build:css` to build the css.

### Manually installing the plugin

-   Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/simple-prompt-plugin/`.
-   Reload Obsidian.

**Note**: The plugin saves the API key in the Obsidian vault settings. Make sure to keep your API key safe.

-   If using Git plugin. Add .gitignore with `.obsidian/plugins/simple-prompt-plugin/data.json` to the vault to avoid pushing the API key to your repository.
