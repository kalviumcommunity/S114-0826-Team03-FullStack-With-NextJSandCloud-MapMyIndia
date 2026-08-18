import { Router } from "express";
import vehicleRoutes from "./vehicle.routes";
import tripRoutes from "./trip.routes";
import locationRoutes from "./location.routes";

const router = Router();

router.use("/vehicles", vehicleRoutes);
router.use("/vehicles", tripRoutes);
router.use("/locations", locationRoutes);

export default router;