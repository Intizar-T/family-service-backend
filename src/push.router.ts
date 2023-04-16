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
    const subscription_mobile =
      '{"endpoint":"https://fcm.googleapis.com/fcm/send/cWoWRMX6Np8:APA91bFAOSNUhGaN7Xr7oRcOB_FxvaixYd78hRpMqGrfrn0zokWeXG5BAqzl4HQ1n5ovqMGKJznDE1dShdCA_jAj-Bi3EUlgUAOX0pFiJnQVbGsnRB1s0u9u6D7AAQ7g0PmbDcUstZFt","expirationTime":null,"keys":{"p256dh":"BK0WmdHxjdSa9Z_oMk016DERlcrfve_uRXw9IGXvt4bv4FIcCjlG45_98cgcF2SbxzeDYfM1FkFpeAh23W9TMqc","auth":"BiMNNQRhCWr2GCpg0SBJuQ"}}';
    const subscription_laptop =
      '{"endpoint":"https://fcm.googleapis.com/fcm/send/ezsyZnBFWWs:APA91bEWf_jhhG72b7uiJAaDoKNNOy16SRBs1c5SFArIgA4fe6xJlbLy-zFc5DH0UuugZtyuirNuSyKAfmqIvfncajbQNTAxz8CU-c5MXsLnvxyT9MfvATC04hWLKytbJKShiz2g_3oZ","expirationTime":null,"keys":{"p256dh":"BPuv5yVUxRwrOnE1K86tUGKV88jh0DEjmSl70WKJcyXfyjnyUsayMnWxq7pfYU1QIBYovGTmS9MRsFBHdhuqydw","auth":"asHzoO70wd2bjh0X-6OlLQ"}}';
    const result = await webpush.sendNotification(
      JSON.parse(subscription_laptop),
      JSON.stringify(notification)
    );
    console.log(result);
    // const command = new GetItemCommand({
    //   TableName: "intizar-scratch",
    //   Key: {
    //     id: {
    //       N: "0",
    //     },
    //   },
    // });
    // const user = await db_client.send(command);
    // console.log(user["Item"]["connectedUsers"]["L"]);
    // retrieve subscription from mongodb and push notificaiton
    // const subscriptions: any[] = []; //get all subscriptions
    // for (const subscription of subscriptions) {
    //   await webpush.sendNotification(
    //     subscription,
    //     JSON.stringify(notification)
    //   );
    // }
    return res.status(200).send({ success: true, data: result });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
