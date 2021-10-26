import Base from "./Base.js";

export default class Pet extends Base {
    constructor({name, type, age}) {
        super();

        this.name = name;
        this.type = type;
        this.age = age;
    }
}