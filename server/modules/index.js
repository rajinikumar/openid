import { Router } from "express";
import userRoutes from "./user";
import authRoutes from "./auth";
import clientRoutes from "./client";
const routes = new Router();

/** All top level routes (Example: /api/user) */
routes.use("/user", userRoutes);
routes.use("/auth", authRoutes);
routes.use("/client", clientRoutes);

export default routes;
