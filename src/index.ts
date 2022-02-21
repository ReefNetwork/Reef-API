import * as admin from "firebase-admin";
import * as express from "express";
import * as functions from "firebase-functions";

import * as v1 from "./v1/";

admin.initializeApp();

const app = express();

app.use("/v1/", v1.router);

// noinspection JSUnusedGlobalSymbols
export const http = functions.region("asia-northeast1").https.onRequest(app);
