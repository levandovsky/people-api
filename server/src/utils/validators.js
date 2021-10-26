import { ObjectId } from "mongodb";

export const validatePersonId = async (id, { req }) => {
    const {
        collections: { people },
    } = req.mongo;

    try {
        const found = await people.findOne({ _id: ObjectId(id) });
        if (!found) return Promise.reject();
        return Promise.resolve();
    } catch (e) {
        console.error("Bad id: ", e);
        return Promise.reject();
    }
};
