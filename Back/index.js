const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.LINK)
    .then((db) => { console.log("Se ha conectado a la BD") })
    .catch((err) => { console.log(err) });

const productos = require("./models/productos");
const carrito = require("./models/carrito");

// rutas ––––––––––––––––––––––––––––––––––––––––––––––––––
app.get("/productos", async (req, res) => {
    let mes = await productos.find().sort({ _id: -1 });
    res.send(mes);
});

app.get("/carrito", async (req, res) => {
    let mes = await carrito.find().sort({ _id: -1 });
    res.send(mes);
});

app.get("/productos/:id/:cantidad/:selected", async (req, res) => {
    await productos.updateOne({ _id: req.params.id }, { quantity: (req.params.cantidad - req.params.selected), carrito: true });

    let mes = await productos.findById(req.params.id);
    mes.quantity = req.params.selected;

    let tosave = {
        name: mes.name,
        quantity: req.params.selected,
        country: mes.country,
        brand: mes.brand,
        image: mes.image,
        price: mes.price,
        totalPrice: mes.price * req.params.selected,
        idOriginal: mes._id
    };

    let savingCarrito = new carrito(tosave);
    await savingCarrito.save();

    res.send({ "respuesta": "listo pa" });
});

app.put("/removeCarrito/:id", async (req, res) => {
    let productCarrito = await carrito.find({ idOriginal: req.params.id });
    await carrito.findOneAndDelete({ idOriginal: req.params.id });

    let productosActuales = await productos.findById(req.params.id);
    await productos.updateOne({ _id: req.params.id }, { quantity: (productosActuales.quantity + productCarrito[0].quantity), carrito: false });

    res.send({ "mensaje": "Actualizado con exito" })
});


app.get("/searchName/:name", async (req, res) => {
    let title = await productos.find({ $or: [{ name: { $regex: req.params.name, $options: "i" } }, { country: { $regex: req.params.name, $options: "i" } }] }).sort({ titulo: 1 });
    res.send(title);
});

app.delete("/deletecarrito", async (req, res) => {
    let productss = await productos.find({ carrito: true });
    productss.forEach(async (e) => {
        let actualizarCantidad = await carrito.find({ idOriginal: e._id.toString() });
        // console.log(actualizarCantidad[0].quantity)
        e.quantity += actualizarCantidad[0].quantity;
        await productos.updateOne({ _id: e._id }, { quantity: e.quantity, carrito: false });
    });
    await carrito.deleteMany({ price: { $gte: 0 } })
    let carro = await carrito.find();
    res.send(carro);
});

app.delete("/deletecarritoBuy", async (req, res) => {
    let productss = await productos.find({ carrito: true });
    productss.forEach(async (e) => {
        await productos.updateOne({ _id: e._id }, { carrito: false });
    });
    await carrito.deleteMany({ price: { $gte: 0 } })
    let carro = await carrito.find();
    res.send(carro);
});

app.listen(3000, () => {
    console.log("Conectado al servidor correctamente")
})