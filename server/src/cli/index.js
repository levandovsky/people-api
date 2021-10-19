import PeopleDatabase from "../server/PeopleDatabase.js";
import Readline from "./Readline.js";

// sukurem async contexta
const main = async () => {
    // sukurem readline instance
    const readline = new Readline();

    // sukurem people database instance
    const database = new PeopleDatabase();

    // uzduodam klausimus
    const name = await readline.question("What is your name?\n");
    const age = await readline.question("What is your age?\n");

    // sukuriam objecta, kur idedam info is klausimu
    const person = {
        name,
        age,
    };

    // pridedam person i database
    await database.addOne(person);

    // uzdarom cli
    readline.close();
};

main();
