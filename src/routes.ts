// Modules
import express from "express";

// Middlewares
// import auth from "./app/middlewares/auth.js";

// Controllers
import UserController from "./app/controllers/UserController.js";
// import SessionController from "./app/controllers/SessionController.js";
// import PassController from "./app/controllers/PassController.js";
// import MediaController from "./app/controllers/MediaController.js";

const routes = express.Router();

// Routes:
// routes.post("/users", UserController.store);
routes.get("/users", UserController.index);
routes.get("/users/find", UserController.show);
// routes.post("/auth/login", SessionController.store);

// routes.post("/media", MediaController.store);
// routes.get("/media/:id", MediaController.show);
// routes.get("/media", MediaController.index);
// routes.use(auth);

// routes.delete("/users/:id", UserController.delete);
// routes.patch("/users/:id", UserController.update);
// routes.post("/users/password/email", PassController.sendEmailForgotPass);
// routes.post("/users/password/code", PassController.verifyCodeForgotPass);
// routes.patch("/users/password/forgot", PassController.forgotPass);
// routes.patch("/users/password/:id", PassController.updatePassword);

export default routes;
