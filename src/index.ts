import { app } from "./app/server";
import { PORT } from "./app/server";
import { checkOrCreatePublicFolder } from "./middleware/files-middleware";

checkOrCreatePublicFolder();
app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
