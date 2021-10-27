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

export const validateCarId = async (id, { req }) => {
    const {
        collections: { cars },
    } = req.mongo;

    try {
        const found = await cars.findOne({ _id: ObjectId(id) });
        if (!found) return Promise.reject();
        return Promise.resolve();
    } catch (e) {
        console.error("Bad id: ", e);
        return Promise.reject();
    }
};

export const validatePetId = async (id, {req}) => {
    const {
        collections: { pets },
    } = req.mongo;

    try {
        const found = await pets.findOne({ _id: ObjectId(id) });
        if (!found) return Promise.reject();
        return Promise.resolve();
    } catch (e) {
        console.error("Bad id: ", e);
        return Promise.reject();
    }
};
