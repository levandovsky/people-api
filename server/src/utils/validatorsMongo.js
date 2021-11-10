import { ObjectId } from "mongodb";

const validateById = (collectionName) => {
    return async (id, { req }) => {
        if (!id) return Promise.reject();

        try {
            const found = await req.app.db
                .collection(collectionName)
                .findOne({
                    _id: ObjectId(id),
                });

            if (!found) return Promise.reject();

            return Promise.resolve();
        } catch (e) {
            console.error("Bad id: ", e);
            return Promise.reject();
        }
    };
};

export const validatePersonId = validateById("people");

export const validateCarId = validateById("cars");

export const validatePetId = validateById("pets");

export const personUpdateValidator = (body) => {
    const allowedFields = ["name", "lastname", "age"];

    const notAllowed = Object.keys(body).some(
        (key) => !allowedFields.includes(key)
    );

    if (notAllowed) return false;

    return true;
};
