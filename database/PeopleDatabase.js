import Database from "../server/Database.js";

export default class PeopleDatabase {
    // private field
    #db;

    constructor() {
        // create database with name 'people'
        this.#db = new Database("people");
    }

    // adds a person to database
    async addOne(person) {
        // get current database state
        const state = await this.#db.read();

        // create person with timestamp
        const update = {
            ...person,
            timestamp: Date.now()
        }

        // append new person to old state
        const newState = [...state, update]

        // write new state to database
        await this.#db.write(newState);
    }

    // get all people
    async getAll() {
        // just return all data from the database
        const data = await this.#db.read();
        return data;
    }

    // get a person by timestamp
    async getOneByTimestamp(timestamp) {
        // get the data from the database
        const data = await this.#db.read();

        // find a person object where timestamp field is the same as we passed to this function
        const found = data.find(person => person.timestamp === timestamp);

        // return whatever the result is
        return found;
    }

    // get person by name
    async getOneByName(name) {
        // get the data from the database
        const data = await this.#db.read();

        // find a person object where name field is the same as we passed to this function
        const found = data.find(person => person.name === name);

        // return whatever the result is
        return found;
    }

    // get all people by name
    async getAllWithName(name) {
        // get the data from the database
        const data = await this.#db.read();

        // filter array based on name we passed to this function
        const found = data.filter(person => person.name === name);

        // return filtered array
        return found;
    }
}