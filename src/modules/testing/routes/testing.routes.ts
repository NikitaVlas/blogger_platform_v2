import { Router } from "express";
import { testingController } from "../controllers/testing.controller";

export const testingRoutes = Router();

testingRoutes.delete(
    "/all-data",
    testingController.deleteAllData,
);
