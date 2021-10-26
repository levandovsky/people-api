import Base from "./Base.js";

export default class Car extends Base {
    constructor({brand}) {
        super();
        this.brand = brand;
    }
}