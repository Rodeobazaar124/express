import { app } from "./server";
import { PORT } from "./server";

app.listen(PORT, () => {
  console.log(`[Server] We're up on http://localhost:${PORT} sir!`);
});
