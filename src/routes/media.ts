import express from "express";

import MediaController from "../app/controllers/MediaController";

const routes = express.Router();

routes.get("/", MediaController.index);
routes.post("/", MediaController.store);
routes.get("/find", MediaController.show);

export default routes;
