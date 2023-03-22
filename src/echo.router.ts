import cors from "cors";
import express, { Request, Response } from "express";

export const echo = express.Router();

echo.get("/", cors(), async (req: Request, res: Response) => {
  res.status(200).send("echoed...");
});
