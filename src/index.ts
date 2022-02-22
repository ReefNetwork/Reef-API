import * as admin from "firebase-admin";
import * as express from "express";
import * as functions from "firebase-functions";
import {FirebaseFunctionsRateLimiter} from "firebase-functions-rate-limiter";

import * as v1 from "./v1/";

admin.initializeApp();

const app = express();
const database = admin.firestore();

const limiter = FirebaseFunctionsRateLimiter.withFirestoreBackend({
  name: "ip-rate-limit",
  maxCalls: 3,
  periodSeconds: 3,
}, database);

app.use("/v1/", v1.router);

const http = functions.region("asia-northeast1").runWith({
  timeoutSeconds: 30,
  memory: "128MB",
}).https;

export const api = http.onRequest(async (req, res) => {
  if (await limiter.isQuotaExceededOrRecordUsage("ip-" + req.ips)) {
    res.status(429).json({error: "Too many requests"});
    return;
  }

  app(req, res);
});
