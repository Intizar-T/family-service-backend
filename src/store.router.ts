import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

export const store = express.Router();

const dbClient = new PrismaClient();

// interface GetProducts {
//   isBought?: boolean;
// }

interface CreateProduct {
  name: string;
  createdUserName: string;
}

interface UpdateProduct {
  name?: string;
  boughtUserName?: string;
  isBought?: boolean;
}

store.get("/", async (req: Request, res: Response) => {
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
    const { createdUserName, name }: CreateProduct = req.body;
    const product = await dbClient.product.create({
      data: {
        name: name,
        createdUserName: createdUserName,
      },
    });
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

store.put("/:id", async (req: Request, res: Response) => {
  try {
    const { boughtUserName, isBought, name }: UpdateProduct = req.body;
    const product = await dbClient.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        name: name,
        boughtUserName: boughtUserName,
        isBought: isBought,
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
