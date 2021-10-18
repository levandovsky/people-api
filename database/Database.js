import { readFile, writeFile } from "fs/promises";
import { readFileSync, writeFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

export default class Database {
    // private field where we will hold path to this database
    #path;

    constructor(name) {
        const path = fileURLToPath(import.meta.url);
        const _dirname = dirname(path);

        // create file path and save it to private field
        this.#path = `${_dirname}/${name}.json`;

        // try to read file
        try {
            // get the data if file exists
            const data = readFileSync(this.#path, "utf8");

            // if the file is empty write empty array into it
            if (!data) writeFileSync(this.#path, JSON.stringify([]));
        } catch {
            // if the file does not exist, write empty array into it
            writeFileSync(this.#path, JSON.stringify([]));
            console.log("Creating database...")
        }
    }

    // writes stringified data to the file
    async write(data) {
        await writeFile(this.#path, JSON.stringify(data));
    }

    // reads file content and returns it as a javascript object
    async read() {
        const data = await readFile(this.#path, "utf8");
        return JSON.parse(data);
    }
}