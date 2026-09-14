import { Router } from "express";
import { testingController } from "../../../composition-root/container";

export const testingRoutes = Router();

testingRoutes.delete(
  "/all-data",
  testingController.deleteAllData.bind(testingController),
);
