import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { env } from "./config/env";

const app = express();

app.use(
  cors({
    origin: env.clientUrl,
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "MapMyIndia API is running",
  });
});

app.use("/api", routes);

app.use(errorMiddleware);

export default app;