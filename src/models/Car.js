import { ObjectId } from "bson";
import Base from "./Base.js";

export default class Car extends Base {
    constructor({brand, ownerId}) {
        super();
        this.brand = brand;
        this.ownerId = ObjectId(ownerId);
    }
}