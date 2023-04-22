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
  product?: string;
  store?: string;
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
  const { userId, name, product, store }: PushParams = req.body;
  try {
    const usersData = await fetch(USER_LAMBDA_URL, {
      method: "GET",
    });
    const users: APIUsers[] = await usersData.json();
    const subscriptions = users
      .filter(({ id, subscription }) => id["N"] !== userId && subscription?.S)
      .map(({ subscription }) => subscription.S);
    let message = "";
    if (product != null) message = `${name} sayta ${product} koshdy`;
    else if (store != null) {
      if (store === "other")
        message = `${name} hazyr magazina girjak bolotran. Kaysy magazindigi belli amaz tolka`;
      else
        message = `${name} hazyr ${store} magazina girjak bolotran. Garak zadynyzlary sayta yazynlar`;
    } else
      message =
        "Nime ucindir bosh uwedomleniya gitdi. Mundey bolmaly amazti, birzada yalnysh gitdi. Admin-a habar berinlar";
    await Promise.all(
      subscriptions.map(async (subscription) => {
        return await webpush.sendNotification(
          JSON.parse(subscription),
          JSON.stringify({
            message,
          })
        );
      })
    );
    return res.status(200).send({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
