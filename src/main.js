import express from "express";
import handlebars from "express-handlebars";
import __dirname from "./utils.js";
import http from "http";
import { Server } from "socket.io";
import { pm } from "./routes/products.routes.js";
// Importaciones de rutas
import { routerProd } from "./routes/products.routes.js";

const app = express();
const PORT = 8080;

// Middleware para enviar y recibir JSON
app.use(express.json());

// Middleware para servicio de archivos estaticos
app.use(express.static(__dirname+"/public"));

// Configuracion del motor de plantillas
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname+"/views");
app.set("view engine", "handlebars");

// Configuracion de rutas
app.use("/api/products", routerProd);

// Configuracion del servidor io
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
})

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User connected");
  
  socket.on("productAdd", (data) => {
    const product = data;
    console.log(product);
    try {
      pm.addProduct(product)
        .then((inf) => {
          if(!isNaN(inf)){
            console.log("Producto agregado correctamente");
            socket.emit("productAdded", {
              productId: inf,
              product: product
            });

          } else {
            console.log(inf);
          }
        })
        .catch((err) => {
          console.log(`Hubo un error (addProduct promise): ${err}`);
        })
    } catch(err) {
      console.log(`Hubo un error: ${err}`);
    }
  });

  socket.on("productDelete", (data) => {
    const pid = data;
    try {
      pm.deleteProduct(pid)
        .then((inf) => {
          if(inf === true){
            console.log("Producto eliminado correctamente");
            socket.emit("productRemoved", pid);
          } else {
            console.log(inf);
          }
        })
        .catch((err) => {
          console.log(`Hubo un error (deleteProduct promise): ${err}`);
        })
    } catch(err) {
      console.log(`Hubo un error: ${err}`); 
    }
  })
});
