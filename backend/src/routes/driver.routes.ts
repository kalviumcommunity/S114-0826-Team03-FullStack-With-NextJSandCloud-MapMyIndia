import { Router } from "express";

import {
  getDriverController,
  getDriverStatsController,
  getDriversController,
} from "../controllers/driver.controller";

const router = Router();

router.get("/", getDriversController);

router.get("/stats", getDriverStatsController);

router.get("/:id", getDriverController);

export default router;