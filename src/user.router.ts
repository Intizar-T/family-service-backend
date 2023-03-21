import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export const user = express.Router();

const dbClient = new PrismaClient({
  datasources: { db: { url: "file:./dev.db" } },
});

interface User {
  name: string;
  nickName?: string;
}

interface UpdateUser {
  nickName?: string;
}

user.post("/", async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const newUser = await dbClient.user.create({
      data: {
        name: user.name,
        nickName: user.nickName,
      },
    });
    return res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.put("/:name", async (req: Request, res: Response) => {
  try {
    const user: UpdateUser = req.body;
    const newUser = await dbClient.user.update({
      where: {
        name: req.params.name,
      },
      data: {
        nickName: user.nickName,
      },
    });
    return res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.get("/", async (req: Request, res: Response) => {
  try {
    const users = await dbClient.user.findMany();
    return res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.get("/:name", async (req: Request, res: Response) => {
  try {
    const name = req.params.name;
    const user = await dbClient.user.findUnique({
      where: {
        name: name,
      },
    });
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.delete("/:id", async (req: Request, res: Response) => {
  try {
    await dbClient.user.delete({
      where: {
        name: req.params.name,
      },
    });
    return res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
