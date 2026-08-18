import { Router } from "express";
import {
  getVehicleController,
  getVehiclesController,
} from "../controllers/vehicle.controller";
import { validatePagination } from "../middleware/validation.middleware";

const router = Router();

router.get(
  "/",
  validatePagination,
  getVehiclesController
);

router.get("/:id", getVehicleController);

export default router;