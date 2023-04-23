import express, { Request, Response } from "express";
import webpush from "web-push";

export const push = express.Router();

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
  message: string;
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

const DEFAULT_FAIL_MESSAGE = "Shulara uwedomleniya iwarip bolmady: ";

push.post("/", async (req: Request, res: Response) => {
  const { userId, message }: PushParams = req.body;
  try {
    const usersData = await fetch(USER_LAMBDA_URL, {
      method: "GET",
    });
    const users: APIUsers[] = await usersData.json();
    let senderSub = "";
    const subscriptionsRecord = users
      .filter(({ id, subscription }) => {
        if (id["N"] === userId) senderSub = subscription?.S;
        return id["N"] !== userId && subscription?.S;
      })
      .map(({ subscription, name }) => {
        return {
          sub: subscription.S,
          name,
        };
      });
    let failMessage = DEFAULT_FAIL_MESSAGE;
    for (const { sub, name } of subscriptionsRecord) {
      const result: webpush.SendResult = await webpush.sendNotification(
        JSON.parse(sub),
        JSON.stringify({
          message,
        })
      );
      console.log(result.statusCode);
      if (result.statusCode === 410) {
        failMessage += `${name}`;
      }
    }
    console.log(failMessage);
    if (failMessage !== "Shulara uwedomleniya iwarip bolmady: ") {
      await webpush.sendNotification(
        JSON.parse(senderSub),
        JSON.stringify({ message: failMessage })
      );
    }
    return res.status(200).send({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
