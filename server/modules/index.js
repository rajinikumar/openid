import { Router } from "express";
import userRoutes from "./user";
import UserServices from "./user/user-services";

const routes = new Router();

/** All top level routes (Example: /api/user) */
routes.use("/user", userRoutes);

export default routes;
