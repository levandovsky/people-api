# Lecture 1
Welcome to the first lecture!
## Overview
- What is NodeJS?
- What is NPM?
- Npm commands
- Basic examples of node packages (fs, os, path)
- How to create a node package?
- What is JSON?
- What is `package.json`?
- ES6 module recap
- `@types/node` package

## Steps
- Install NodeJS
- Open terminal
- Run `npm install` or `npm i` (its the same thing) in this folder
- Run `node index.js` 
- See the result in terminal

## How to create a NodeJS package?
- Create a folder
- Run `npm init -y` to create `package.json` with default configuration
- Alternatively, you can run `npm init` without arguments, it will run cli that will questions about your package to generate a `package.json` file
- Add `"type": "module"` to `package.json` to make use of ES6 Module syntax, otherwise you will have to use `commonjs` module syntax
- VSCode tip: run `npm i @types/node -D` to add types to the project, it will make autocompletion work when importing bundled node modules

## Links
- [NodeJS Docs](https://nodejs.org/docs/latest-v15.x/api/)
- [NPM Docs](https://docs.npmjs.com/)
- [What is JSON?](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)
- [More about package.json](https://docs.npmjs.com/cli/v7/configuring-npm/package-json)
- [ES6 modules CAO](https://cao.lt/topic/js1/lesson/YNBPOxEAACQAuy_n)
- [ES6 modules MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [CommonJS modules](https://nodejs.org/docs/latest/api/modules.html#modules_modules_commonjs_modules)
