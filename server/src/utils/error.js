import chalk from "chalk";

export const sendError = (error, res) => {
    console.error(chalk.red(error));

    res.status(500).send({
        error: error.message,
    });
};
