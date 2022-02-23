import * as express from "express";

import * as xuid from "./xuid";
import * as ranking from "./ranking";

// eslint-disable-next-line new-cap
export const router = express.Router();

router.use("/xuid", xuid.router);
router.use("/ranking", ranking.router);
