import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "passport";

import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import chatsRouter from "./routes/chats.router.js";
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import __dirname from "./utils.js";
import initializePassport from "./config/passport.config.js";

const app = express();
const PORT = 8080;

app.listen(PORT, () => {
  console.log(`servidor escuchando en el puerto ${PORT}`);
});

mongoose
  .connect(
    "mongodb+srv://ramiro:ramiro77@codercluster.smyhhqs.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Conectado a la base de datos!");
  })
  .catch((error) => {
    console.error("Error al conectarse a la base de datos", error);
    process.exit();
  });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);
app.use("/", productsRouter);
app.use("/", cartsRouter);
app.use("/", chatsRouter);
app.use("/", usersRouter);
