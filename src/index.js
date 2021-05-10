import { port } from "./config.js";
import Logger from "./core/loggerHandler.js";
import app from "./app.js";
import { connectToMongoDB } from "./database/mongo/index.js";

app
  .listen(port, async () => {
    console.log(
      "\u001b[" + 35 + "m" + `Server running on port : ${port}` + "\u001b[0m"
    );
    await connectToMongoDB();
  })
  .on("error", (e) => Logger.error(e));
