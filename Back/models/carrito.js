const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const carrito = new Schema({
    name: String,
    quantity: Number,
    country: String,
    brand: String,
    image: String,
    price: Number,
    totalPrice: Number,
    idOriginal: String
});

module.exports = mongoose.model("Carrito", carrito);