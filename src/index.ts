import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { store } from "./store.router";
import { user } from "./user.router";

dotenv.config();

if (!process.env.PORT) {
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10) || 8001;

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/store", store);
app.use("/user", user);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening to port ${PORT}`);
});
