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
      res.send(prods);
    } else {
      // Ternario para evitar que el usuario ingrese un limite mayor a la cantidad
      // de productos existentes, y evitar asi que se imprima NULL
      limit <= prods.length ? limit : limit = prods.length;

      let prodsToSend = [];
      for (let _ = 0; _ < limit; _++){
        prodsToSend.push(prods[_])
      }
      res.send(prodsToSend)
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerProd.get("/:pid", async (req, res) => {
  // Cuerpo del servicio GET by ID de products. Muestra el producto dado su ID (pid)
  const pid = parseInt(req.params.pid);
  try {
    const prod = await pm.getProductById(pid);
    if(prod) {
      res.send(prod);
    } else {
      res.status(404).send(`No existe ningun producto con el id ${pid}`);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerProd.post("/", async (req, res) => {
  // Cuerpo del servicio POST de products. Crea nuevos productos en products.json
  try {
    const conf = await pm.addProduct(req.body);
    if(conf === true) {
      res.status(201).send("Producto agregado correctamente");
    } else {
      res.status(400).send(conf);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerProd.put("/:pid", async (req, res) => {
  // Cuerpo del servicio PUT de products. Actualiza un producto dado su ID (pid)
  const pid = parseInt(req.params.pid);
  try {
    const conf = await pm.updateProduct(pid, req.body);
    if(conf === true) {
      res.status(201).send("Producto actualizado correctamente");
    } else {
      res.status(400).send(conf);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

routerProd.delete("/:pid", async (req, res) => {
  // Cuerpo del servicio DELETE de products. Elimina un producto dado su ID (pid)
  const pid = parseInt(req.params.pid);
  try {
    const conf = await pm.deleteProduct(pid);
    if(conf === true) {
      res.send("Producto eliminado correctamente");
    } else {
      res.status(400).send(conf);
    }
  } catch(err) {
    res.status(500).send(`Hubo un error: ${err}`);
  }
})

export default routerProd;