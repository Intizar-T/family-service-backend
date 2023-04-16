import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { store } from "./store.router";
import { user } from "./user.router";
import { echo } from "./echo.router";
import { initiateWebpush, push } from "./push.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 8001;
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

const app = express();

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use("/store", store);
app.use("/user", user);
app.use("/echo", echo);
app.use("/push", push);

initiateWebpush(publicVapidKey, privateVapidKey);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, res: any) => {
  res.status(500);
  // console.error(err);
  console.log("Internal Server Error");
  res.send("Internal Server Error");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening to port ${PORT}`);
});
