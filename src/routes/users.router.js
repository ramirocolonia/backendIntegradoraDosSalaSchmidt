import { Router } from "express";
import jwt from "jsonwebtoken";
import UserManagerDB from "../dao/UserManagerDB.js";
import { passportCall } from "../utils.js";

const usersRouter = Router();

usersRouter.post("/register", async (req, res) => {
  try {
    const userManager = new UserManagerDB();
    const resp = await userManager.registerUser(req.body);
    res.send(resp);
  } catch (error) {
    res.send({ status: "error", message: "Error en ejecución, " + error });
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const userManager = new UserManagerDB();
    const resp = await userManager.login(req.body);
    if (resp.status === "success") {
      const { first_name, last_name, email, rol } = resp.payload;
      const token = jwt.sign({ first_name, last_name, email, rol }, "ecomSecret", { expiresIn: "24h" });
      res.cookie("tokenUsrCookie", token, {maxAge: 60 * 60 * 1000 * 24, httpOnly: true});
      resp.token = token;
    }
    res.send(resp);
  } catch (error) {
    res.send({ status: "error", message: "Error en ejecución, " + error });
  }
});

usersRouter.get("/api/sessions/current", passportCall("jwt"), async (req, res)=>{
  res.send(req.user);
});

export default usersRouter;
