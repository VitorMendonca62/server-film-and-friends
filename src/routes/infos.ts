import express from "express";
import UserMediaInfoController from "../app/controllers/UserMediaInfoController";

const routes = express.Router();

routes.get("/:type/:id", UserMediaInfoController.index);
routes.post("/", UserMediaInfoController.store);

export default routes;
