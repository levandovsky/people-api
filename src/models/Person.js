import Base from "./Base.js";

export default class Person extends Base {
    constructor({ name, lastname, age }) {
        super();

        this.name = name;
        this.lastname = lastname;
        this.age = age;
    }
}
