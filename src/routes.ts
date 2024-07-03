// Libraries
import express from "express";

// Import routes
import routesUsers from "./routes/users";
import routesMedias from "./routes/media";
import routesInfos from "./routes/infos";
import routesRooms from "./routes/rooms";

// Initialize router
const routes = express.Router();

// Routes
routes.use("/users", routesUsers);
routes.use("/medias", routesMedias);
routes.use("/infos", routesInfos);
routes.use("/rooms", routesRooms);

export default routes;
