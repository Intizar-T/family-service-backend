import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export const user = express.Router();

const dbClient = new PrismaClient({
  datasources: { db: { url: "file:./dev.db" } },
});

interface User {
  device: string;
  name: string;
}

interface UpdateUser {
  device?: string;
  name?: string;
}

user.post("/", async (req: Request, res: Response) => {
  try {
    const { device, name }: User = req.body;
    const newUser = await dbClient.user.create({
      data: {
        device: device,
        name: name,
      },
    });
    return res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.put("/:device_name", async (req: Request, res: Response) => {
  try {
    const { device, name }: UpdateUser = req.body;
    const {
      device: oldDevice,
      name: oldName,
    }: { device: string; name: string } = JSON.parse(req.params.device_name);
    const newUser = await dbClient.user.update({
      where: {
        device_name: {
          device: oldDevice,
          name: oldName,
        },
      },
      data: {
        device: device,
        name: name,
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

user.get("/:device_name", async (req: Request, res: Response) => {
  try {
    const { device, name }: { device: string; name: string } = JSON.parse(
      req.params.device_name
    );
    const user = await dbClient.user.findUnique({
      where: {
        device_name: {
          device,
          name,
        },
      },
    });
    console.log(user);
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

user.delete("/:device_name", async (req: Request, res: Response) => {
  const { device, name }: { device: string; name: string } = JSON.parse(
    req.params.device_name
  );
  try {
    await dbClient.user.delete({
      where: {
        device_name: {
          device,
          name,
        },
      },
    });
    return res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error.message);
  }
});
