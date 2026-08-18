import { Router } from "express";
import {
  getTripController,
  getTripsController,
} from "../controllers/trip.controller";
import { validatePagination } from "../middleware/validation.middleware";

const router = Router();

router.get(
  "/:vehicleId/trips",
  validatePagination,
  getTripsController
);

router.get("/trip/:id", getTripController);

export default router;