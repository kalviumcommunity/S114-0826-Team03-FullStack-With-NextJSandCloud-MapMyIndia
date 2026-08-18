import { Router } from "express";
import { getLocationsController } from "../controllers/location.controller";
import { validatePagination } from "../middleware/validation.middleware";

const router = Router();

router.get(
  "/:vehicleId",
  validatePagination,
  getLocationsController
);

export default router;