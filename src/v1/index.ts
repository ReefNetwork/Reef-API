import * as express from "express";

import * as xuid from "./xuid";

// eslint-disable-next-line new-cap
export const router = express.Router();

router.use("/xuid", xuid.router);
