import { Router } from "express";
import { authController } from "../../../composition-root/container";

export const securityRoutes = Router();

securityRoutes.get("/devices", authController.getDevices.bind(authController));
securityRoutes.delete(
  "/devices",
  authController.deleteAllOtherDevices.bind(authController),
);
securityRoutes.delete(
  "/devices/:deviceId",
  authController.deleteDevice.bind(authController),
);
