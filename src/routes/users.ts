import express from "express";
import UserController from "../app/controllers/UserController";
import SessionController from "../app/controllers/SessionController";
import PasswordController from "../app/controllers/PasswordController";

const routes = express.Router();

routes.post("/", UserController.store);
routes.post("/auth/login", SessionController.store);

routes.post("/password/email", PasswordController.takeCodeAndSendEmail);
routes.post("/password/code", PasswordController.verifyCode);
routes.patch("/password/update", PasswordController.forgotPass);

// routes.use(auth)
routes.get("/", UserController.index);
routes.get("/find", UserController.show);

routes.delete("/:id", UserController.delete);
routes.patch("/:id", UserController.update);

routes.patch("/password/:id", PasswordController.updatePassword);

export default routes