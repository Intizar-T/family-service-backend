import express, { Request, Response } from "express";
import webpush from "web-push";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

export const push = express.Router();

const db_client = new DynamoDBClient({ region: "ap-northeast-2" });

const publicVapidKey =
  "BLwFnMhO1kiK0tDNsj7N_ke7KvQKfNo1evw-CUOSEuho0wFEiPdCJd1AvIInEMuIsKoMr0gvxgLtpl60Zj6kdEE";
const privateVapidKey = "Xf6mKZYbWZmJBFkdpkNE4-QsPdiEnglOJn39jUoYmjw";

export const initiateWebpush = (): void => {
  webpush.setVapidDetails(
    "https://intizar-t.github.io/family-store",
    publicVapidKey,
    privateVapidKey
  );
};

push.post("/", async (req: Request, res: Response) => {
  const notification: { title: string } = req.body;
  console.log(notification);
  try {
    const command = new GetItemCommand({
      TableName: "intizar-scratch",
      Key: {
        id: {
          N: "0",
        },
      },
    });
    const user = await db_client.send(command);
    console.log(user["Item"]["connectedUsers"]["L"]);
    // retrieve subscription from mongodb and push notificaiton
    // const subscriptions: any[] = []; //get all subscriptions
    // for (const subscription of subscriptions) {
    //   await webpush.sendNotification(
    //     subscription,
    //     JSON.stringify(notification)
    //   );
    // }
    return res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
