import { app } from "./app/server";
import { PORT } from "./app/server";
import os from "os";
app.listen(PORT, () => {
  console.log("--- System Specs ---");
  console.log("Platform:", os.platform());
  console.log("Arch:", os.arch());
  console.log("Total Memory:", os.totalmem() / (1024 * 1024) + " MB");
  console.log("Free Memory:", os.freemem() / (1024 * 1024) + " MB");
  console.log("--- Host Info ---");
  console.log("Hostname:", os.hostname());
  console.log(`[Port:  ${PORT} sir!`);
});
