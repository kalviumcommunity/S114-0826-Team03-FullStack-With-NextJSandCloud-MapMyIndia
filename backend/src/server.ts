import app from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.port, () => {
    console.log(
      `MapMyIndia backend running on port ${env.port}`
    );
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});