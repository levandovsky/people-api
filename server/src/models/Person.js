export default class Person {
    constructor(name, age) {
        if (!name || !age) {
            throw new Error("Missing field!");
        }

        this.name = name;
        this.age = age;
        this.createdAt = Date.now();
        this.updatedAt = null;
    }
}
