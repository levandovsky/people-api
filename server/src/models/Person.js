export default class Person {
    constructor({ name, lastname, age }) {
        this.name = name;
        this.lastname = lastname;
        this.age = age;

        this.createdAt = Date.now();
        this.updatedAt = null;
        this.pets = [];
    }
}
