import * as express from "express";
import * as mysql from "./mysql";

// eslint-disable-next-line new-cap
export const router = express.Router();

router.get("/", (request, response) => {
  const name = request.query.name;
  const client = mysql.createReefServerConnection();
  /* eslint-disable indent */
  client.query(
    "SELECT xuid FROM `user` WHERE `name` = ?",
    [name],
    (error, results) => {
      if (error) {
        response.status(500).json({
          error: "Failed to connect to the database or invalid query.",
        });
      } else if (!results[0]) {
        response.status(404).json({
          error: "User not found",
        });
      } else {
        response.status(200).json({
          name: name,
          xuid: results[0].xuid,
        });
      }
      client.end();
    },
  );
});
