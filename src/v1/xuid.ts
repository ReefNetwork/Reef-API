import * as express from "express";
import * as mysql from "./mysql";

// eslint-disable-next-line new-cap
export const router = express.Router();

router.get("/", (request, response) => {
  const name = request.get("name");
  mysql.client.changeUser({
    database: "s20_CORAL_REEF",
  });
  /* eslint-disable indent */
  mysql.client.query(
    "SELECT xuid FROM `USER` WHERE `name` = ?",
    [name],
    (error, results) => {
      if (error) {
        response.status(500).json({
          error: error.message,
        });
      } else if (!results.isInteger) {
        response.status(404).json({
          error: "User not found",
        });
      } else {
        response.status(200).json({
          name: name,
          xuid: results[0].xuid,
        });
      }
    },
  );
});
