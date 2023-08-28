import { app } from "./app/server";
import { PORT } from "./app/server";

app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
