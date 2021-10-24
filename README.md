# Lecture 6
Restructure our project even more. Add `eslint`, `prettier` and `dotenv` packages, and some vscode extensions to make better use of the packages.

## Overview
Split our project into `client` and `server` folders. Put our code in `src` folder to separate it. We then added:
- `eslint` - enforce some code styling and show errors if there are problems with our code
- `prettier` - format our code, helpful when eslint `--fix` flag doesn't do good enough job
- `dotenv` - help us store variables that are needed on the server environment

## Material
- [`eslint`](https://eslint.org/)
- [`prettier`](https://prettier.io/docs/en/index.html)
- [`dotenv`](https://www.npmjs.com/package/dotenv)

## VSCode extensions
Check `settings.json` in `.vscode` folder to see settings we added.
- [`eslint`](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [`prettier`](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
