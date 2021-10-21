import mongoose from "mongoose";

const {Schema, model} = mongoose;

const personSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    }
});

export default model("people", personSchema);
