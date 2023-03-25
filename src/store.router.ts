import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express, { Request, Response } from "express";

export const store = express.Router();

const dbClient = new PrismaClient({
  datasources: { db: { url: "file:./dev.db" } },
});

// interface GetProducts {
//   isBought?: boolean;
// }

interface CreateProduct {
  name: string;
  userDevice: string;
  userName: string;
  amount?: number;
}

interface UpdateProduct {
  name?: string;
  boughtUserName?: string;
  boughtUserDevice?: string;
  isBought?: boolean;
  amount?: number;
}

store.get("/", cors(), async (req: Request, res: Response) => {
  try {
    const products = await dbClient.product.findMany();
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

store.get("/:id", async (req: Request, res: Response) => {
  try {
    const product = await dbClient.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        boughtUser: true,
        createdUser: true,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

store.post("/", async (req: Request, res: Response) => {
  try {
    const { userDevice, userName, name, amount }: CreateProduct = req.body;
    const product = await dbClient.product.create({
      data: {
        name,
        userName,
        userDevice,
        amount,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

store.put("/:id", async (req: Request, res: Response) => {
  try {
    const {
      boughtUserName,
      isBought,
      name,
      amount,
      boughtUserDevice,
    }: UpdateProduct = req.body;
    const product = await dbClient.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name,
        boughtUserName,
        isBought,
        amount,
        boughtUserDevice,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

store.delete("/:id", async (req: Request, res: Response) => {
  try {
    await dbClient.product.delete({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).send("success");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
