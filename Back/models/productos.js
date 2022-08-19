const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productos = new Schema({
    name: String,
    quantity: Number,
    country: String,
    brand: String,
    image: String,
    price: Number,
    carrito: Boolean,
});

module.exports = mongoose.model("Productos", productos);