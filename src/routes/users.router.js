import { Router } from "express";
import jwt from "jsonwebtoken";
import UserManagerDB from "../dao/UserManagerDB.js";

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
    const token = jwt.sign(resp.payload, "ecomSecret", { expiresIn: "24h" });
    res.cookie("tokenUsrCookie", token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    });
    resp.token = token;
    console.log(resp);
    res.send(resp);
  } catch (error) {}
});

// usersRouter.get("/faillogin", (req, res) => {
//   console.log("FAIL LOGIN error en el login");
//   res.send({ error: "FAIL LOGIN error en el login" });
// });

// // usersRouter.get("/login/github", passport.authenticate("github", {scope:["user: email"]}), async (req,res)=>{});

// // usersRouter.get("/login/githubcbauth", passport.authenticate("github", {failureRedirect:"/login"}), async (req, res)=> {
// //   req.session.user = {
// //     name: req.user.email,
// //     rol: req.user.rol
// //   };
// //   res.redirect("/products");
// // });

usersRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (!error) {
      res.redirect("/login");
    } else {
      res.send({ status: "error", message: "Error en logout, " + error });
    }
  });
});

export default usersRouter;
