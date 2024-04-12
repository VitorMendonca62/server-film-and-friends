// Modules
import express from "express";

// Middlewares
// import auth from "./app/middlewares/auth.js";


import routesUsers from "./routes/users";
import routesMedias from "./routes/media";

const routes = express.Router();

// Routes:

routes.use("/users", routesUsers);
routes.use("/medias", routesMedias);

export default routes;
