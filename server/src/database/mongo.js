import chalk from "chalk";
import { MongoClient } from "mongodb";
export const createClient = async (config) => {
    if (Object.values(config).some((value) => !value)) {
        throw new Error("Missing config field!");
    }

    const { user, pw, cluster, db } = config;
    const url = `mongodb+srv://${user}:${pw}@${cluster}/${db}?retryWrites=true&w=majority`;

    try {
        const client = new MongoClient(url);

        console.log(
            `${chalk.green("Mongo:")} Connecting to ${chalk.blue(
                config.db
            )} db on ${chalk.blue(config.cluster)}`
        );

        await client.connect();

        console.log(`${chalk.green("Mongo:")} Connected!`);

        return client;
    } catch (e) {
        console.log(chalk.red("Error connecting to mongo!", e));
        throw e;
    }
};
