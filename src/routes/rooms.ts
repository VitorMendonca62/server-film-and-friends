import express from "express";

import RoomController from "../app/controllers/RoomController";

const routes = express.Router();
routes.get("/:type/:page", RoomController.index);
routes.post("/", RoomController.store);

export default routes;
