import { app } from "./app/server";
import { PORT } from "./app/server";
import os from "os";
app.listen(PORT, () => {
  console.log(
    "Platform:",
    os.type() + " " + os.release() + "" + os.machine() + ""
  );
  console.log("Total Memory:", os.totalmem() / (1024 * 1024) + " MB");
  console.log("Free Memory:", os.freemem() / (1024 * 1024) + " MB");
  console.log("Hostname:", os.hostname());
  console.log(`Web Port:  ${PORT}`);
  console.log(`\n\n`);
  console.log(os.networkInterfaces());
});
