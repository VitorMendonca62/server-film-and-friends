// Modules
import express from "express";

// Middlewares

import routesUsers from "./routes/users";
import routesMedias from "./routes/media";
import routesInfos from "./routes/infos";

const routes = express.Router();

// Routes:

routes.use("/users", routesUsers);
routes.use("/medias", routesMedias);
routes.use("/infos", routesInfos);

export default routes;
