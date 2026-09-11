import { Router } from "express";
import { authController } from "../../auth/controllers/auth.controller";

export const securityRoutes = Router();

securityRoutes.get("/devices", authController.getDevices);
securityRoutes.delete("/devices", authController.deleteAllOtherDevices);
securityRoutes.delete("/devices/:deviceId", authController.deleteDevice);
