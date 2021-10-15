import { writeFileSync, readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";

// write 'hello world' to 'test.txt' file
writeFileSync("./test.txt", "hello world");

// log the context of the 'test.txt' to the console
console.log(readFileSync("./test.txt", "utf8"));

// log path to current file to the console
console.log(fileURLToPath(import.meta.url));

// log current directory name to the console
console.log(dirname(fileURLToPath(import.meta.url)));
