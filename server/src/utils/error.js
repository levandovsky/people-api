export const sendError = (error, res) => {
    console.error(error);
    res.status(500).send({
        error: error.message,
    });
};
