import * as admin from "firebase-admin";
import * as express from "express";

import * as v1 from "./v1/";

admin.initializeApp();

const app = express();

app.use("v1/", v1.router);
