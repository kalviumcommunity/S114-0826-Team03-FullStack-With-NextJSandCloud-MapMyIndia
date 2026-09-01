import { Router } from "express";

import vehicleRoutes from "./vehicle.routes";
import tripRoutes from "./trip.routes";
import locationRoutes from "./location.routes";
import driverRoutes from "./driver.routes";
import geofenceRoutes from "./geofence.routes";
import maintenanceRoutes from "./maintenance.routes";

const router = Router();

router.use("/vehicles", vehicleRoutes);
router.use("/vehicles", tripRoutes);
router.use("/locations", locationRoutes);
router.use("/drivers", driverRoutes);
router.use("/geofences", geofenceRoutes);
router.use("/maintenance", maintenanceRoutes);

export default router;