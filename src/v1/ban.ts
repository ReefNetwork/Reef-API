import * as express from "express";
import {Response} from "express";
import * as mysql from "./mysql";
import {MysqlError} from "mysql";

// eslint-disable-next-line new-cap
export const router = express.Router();

router.get("/", (request, response) => {
  const client = mysql.createReefServerConnection();
  /* eslint-disable indent */
  client.query(
    "SELECT bans.id, reason, ipBan, deviceBan, create_time as createTime,\n" +
    "expire_time AS expireTime, u.xuid, u.name, by_u.xuid AS byXuid,\n" +
    "by_u.name AS byName \n" +
    "FROM bans\n" +
    "    LEFT JOIN user u on u.id = bans.user_id\n" +
    "    RIGHT JOIN user by_u on by_u.id = bans.banned_by\n" +
    "WHERE active = TRUE\n" +
    "  AND expire_time > NOW()",
    [],
    (error, results) => {
      client.end();
      resultProcessor(response, error, results);
    },
  );
});

/**
 * @param {Response} response
 * @param {MysqlError} error
 * @param {Array} results
 */
function resultProcessor(response: Response, error: MysqlError | null,
  results: Array<{
    id: number, reason: string, ipBan: number, deviceBan: number,
    createTime: string, expireTime: string, xuid: string, name: string,
    byXuid: string, byName: string
  }>): void {
  if (error) {
    response.status(500).json({
      error: "Failed to connect to the database or invalid query.",
    });
  } else {
    response.status(200).json(results);
  }
}
