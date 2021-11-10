export const sortValidator = (direction) => {
    if (direction === undefined) return true;

    const allowed = ["ASC", "DESC"];

    return allowed.includes(direction);
};
