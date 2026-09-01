import { Router } from "express";

import {
  createMaintenanceController,
  deleteMaintenanceController,
  getMaintenanceByIdController,
  getMaintenanceController,
  getMaintenanceStatsController,
} from "../controllers/maintenance.controller";

const router = Router();

router.get("/", getMaintenanceController);

router.get("/stats", getMaintenanceStatsController);

router.get("/:id", getMaintenanceByIdController);

router.post("/", createMaintenanceController);

router.delete("/:id", deleteMaintenanceController);

export default router;