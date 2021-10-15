import { createInterface } from "readline";
import fs from "fs/promises";

// create readline interface to get user input
const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

// ask name, and then execute callback
rl.question("What is your name?\n", (name) => {
    // ask age, and then execute callback
    rl.question("What is your age?\n", (age) => {
        // create person object from user inputs
        const person = {
            name,
            age
        };

        // read 'db.json' file
        fs.readFile("./db.json", "utf8")
        .then((data) => {
            // create variable to save our data
            let oldState;

            // check if there is any data in file, if not - write empty array
            if (!data) {
                // set saveState to empty array
                oldState = [];

                // write saveState to file
                fs.writeFile("./db.json", JSON.stringify(oldState))
            }

            // set saveState to data from file
            oldState = JSON.parse(data);

            // append person to oldState and save the result to newState variable
            const newState = [...oldState, person]

            // write result to 'db.json' file
            fs.writeFile("./db.json", JSON.stringify(newState))
            .then(() => {
                // log success message after file was saved
                console.log("Saved person to 'db.json'")
            })

            // close readline
            rl.close();
        })
        .catch((err) => {
            // log that file doesn't exist yet
            console.log("Look like 'db.json' doesn't exist yet. Creating...")

            // this callback will execute if file doesn't exist
            fs.writeFile("./db.json", JSON.stringify([person])).then(() => {
                // log success message after file was saved
                console.log("Saved person to 'db.json'")
            })

            // close readline
            rl.close();
        })
    })
});
