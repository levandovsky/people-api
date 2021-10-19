import readline from "readline";

export default class Readline {
    // private field for readline interface
    #rl;

    constructor() {
        // create readline interface
        this.#rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    // promisify question method of readline
    async question(question) {
        return new Promise((resolve) =>
            this.#rl.question(question, resolve)
        );
    }

    // closes readline interface
    close() {
        this.#rl.close();
    }
}
