import { Router } from "express";

import {
  getVehicleController,
  getVehicleStatsController,
  getVehiclesController,
} from "../controllers/vehicle.controller";

import { validatePagination } from "../middleware/validation.middleware";

const router = Router();

router.get(
  "/",
  validatePagination,
  getVehiclesController
);

router.get(
  "/stats",
  getVehicleStatsController
);

router.get(
  "/:id",
  getVehicleController
);

export default router;