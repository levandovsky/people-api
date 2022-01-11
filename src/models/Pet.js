import { ObjectId } from "bson";
import Base from "./Base.js";

export default class Pet extends Base {
    constructor({name, type, age, ownerId}) {
        super();

        this.name = name;
        this.type = type;
        this.age = age;
        this.ownerId = ObjectId(ownerId);
    }
}