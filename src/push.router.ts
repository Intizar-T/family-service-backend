import express, { Request, Response } from "express";
import webpush from "web-push";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

export const push = express.Router();

const db_client = new DynamoDBClient({ region: "ap-northeast-2" });

export const initiateWebpush = (
  publicVapidKey: string,
  privateVapidKey: string
): void => {
  webpush.setVapidDetails(
    "https://intizar-t.github.io/family-store",
    publicVapidKey,
    privateVapidKey
  );
};

const USER_LAMBDA_URL =
  "https://z7x9jyq1mj.execute-api.ap-northeast-2.amazonaws.com/dev/user";

interface PushParams {
  userId: string;
  name: string;
  product: string;
}

type APIUsers = {
  name: {
    S: string;
  };
  device: {
    S: string;
  };
  createdProduct: {
    L: string[];
  };
  id: {
    N: string;
  };
  subscription: {
    S: string;
  };
};

push.post("/", async (req: Request, res: Response) => {
  const { userId, name, product }: PushParams = req.body;
  try {
    // const command = new ScanCommand({
    //   TableName: "intizar-scratch",
    // });
    // const users = (await db_client.send(command))["Items"];
    const usersData = await fetch(USER_LAMBDA_URL, {
      method: "GET",
    });
    const users: APIUsers[] = await usersData.json();
    console.log(users);
    const subscriptions = users
      .filter(({ id, subscription }) => id["N"] !== userId && subscription?.S)
      .map(({ subscription }) => subscription.S);
    console.log(subscriptions);
    // const results = (
    await Promise.all(
      subscriptions.map(async (subscription) => {
        console.log(JSON.parse(subscription));
        return await webpush.sendNotification(
          JSON.parse(subscription),
          JSON.stringify({
            user: name,
            product,
          })
        );
      })
    );
    // ).filter((result) => result.statusCode);
    return res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
