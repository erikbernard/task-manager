import { env } from "./config/env";
import { initializeDatabase } from "./config/database";
import { createApp } from "./app";

async function startServer() {
  const db = await initializeDatabase();
  const app = createApp(db);

  app.listen(env.PORT, () => {
    console.log(`vai goku	(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧ ${env.PORT}`);
  });
}

startServer();