import { Router } from "express";
import { CartManager } from "../models/cart_manager.js"

const routerCart = Router();
const cm = new CartManager();

routerCart.post("/", async (req, res) => {
  // Cuerpo del servicio POST de carts para crear un carrito nuevo
  try{
    const conf = await cm.createCart();
    if(conf === true){
      res.status(201).send("Carrito creado correctamente");
    } else {
      res.status(400).send(`Hubo un error al crear el carrito: ${conf}`);
    }
  } catch(err){
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerCart.get("/:cid", async (req, res) => {
  // Cuerpo del servicio GET de carts. Lista los productos de un carrito
  // dado su ID (cid)
  const cid = parseInt(req.params.cid);
  try {
    const cartProducts = await cm.getCartProducts(cid);
    if(cartProducts){
      res.send(cartProducts)
    } else {
      res.status(404).send(`No existe ningun carrito con el ID ${cid}`);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerCart.post("/:cid/product/:pid", async (req, res) => {
  // Cuerpo del servicio POST de carts, para agregar productos a un carrito
  const cid = parseInt(req.params.cid);
  const pid = parseInt(req.params.pid);
  try {
    const conf = await cm.addProductToCart(cid, pid);
    if(conf === true){
      res.status(201).send("Producto agregado al carrito correctamente");
    } else {
      res.status(400).send(conf);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }

})

export default routerCart;