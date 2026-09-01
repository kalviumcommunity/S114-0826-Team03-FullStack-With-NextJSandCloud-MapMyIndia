import { Router } from "express";

import {
  createGeofenceController,
  deleteGeofenceController,
  getGeofenceController,
  getGeofencesController,
} from "../controllers/geofence.controller";

const router = Router();

router.get("/", getGeofencesController);

router.get("/:id", getGeofenceController);

router.post("/", createGeofenceController);

router.delete("/:id", deleteGeofenceController);

export default router;