import { Router } from "express";
import { ProductManager } from "../models/product_manager.js"

const routerProd = Router();
const pm = new ProductManager();

routerProd.get("/", async (req, res) => {
  // Cuerpo del servicio GET de products. Muestra todos los productos, o los
  // productos que correspondan con la sentencia limit (en caso de que aplique)
  let limit = req.query.limit;
  
  try {
    const prods = await pm.getProducts();
    if(!limit) {
      // Si no hay limite, devuelve todos los productos
      res.render("home", {
        products: prods,
        style: "home_style.css"
      })
    } else {
      // Ternario para evitar que el usuario ingrese un limite mayor a la cantidad
      // de productos existentes, y evitar asi que se imprima NULL
      limit <= prods.length ? limit : limit = prods.length;

      let prodsToSend = [];
      for (let _ = 0; _ < limit; _++){
        prodsToSend.push(prods[_])
      }
      res.render("home", {
        products: prodsToSend,
        style: "style.css"
      })
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerProd.get("/realtime", async (req, res) => {
  try {
    const prods = await pm.getProducts();
    res.render("realTimeProducts", {
      products: prods,
      style: "style.css"
    })
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

export { routerProd, pm };