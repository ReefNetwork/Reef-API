import {Response, Router} from "express";
import * as mysql from "./mysql";
import {MysqlError} from "mysql";

// eslint-disable-next-line new-cap
export const router = Router();

const NOT_SHOW = ["CookPad666", "hera368025", "aikawaosushi", "rotte0315"];

router.get("/", (request, response) => {
  const type = request.query.type;
  const before = request.query.before;
  const after = request.query.after;
  switch (type) {
    case "dig":
      digRanking(response, before, after);
      break;
    case "exp":
      expRanking(response);
      break;
    case "money":
      moneyRanking(response);
      break;
    default:
      response.status(404).json({
        error: "Unknown ranking type",
      });
      break;
  }
});

/**
 * @param {Response} response
 * @param {any} before
 * @param {any} after
 */
function digRanking(response: Response, before: any, after: any): void {
  const client = mysql.createReefSeichiConnection();

  if (before != undefined && after != undefined) {
    /* eslint-disable indent */
    client.query(
      "SELECT USER.name AS name, SUM(SESSION_RECORD.break_count) AS value,\n" +
      "SESSION_RECORD.xuid\n" +
      "FROM `SESSION_RECORD`, `USER`\n" +
      "WHERE join_time >= ? AND quit_time <= ?\n" +
      "AND USER.xuid = SESSION_RECORD.xuid\n" +
      "GROUP BY SESSION_RECORD.xuid ORDER BY value DESC",
      [new Date(Number(before)).toISOString(),
        new Date(Number(after)).toISOString()],
      (error, results) => {
        if (error) {
          console.log(error.message);
          response.status(500).json({
            error: "Failed to connect to the database or invalid query.",
          });
        } else {
          resultProcessor(response, error, results);
        }
        client.end();
      },
    );
  } else {
    /* eslint-disable indent */
    client.query(
      "SELECT USER.name AS name, SUM(SESSION_RECORD.break_count) AS value,\n" +
      "SESSION_RECORD.xuid\n" +
      "FROM `SESSION_RECORD`, `USER`\n" +
      "WHERE USER.xuid = SESSION_RECORD.xuid\n" +
      "GROUP BY SESSION_RECORD.xuid ORDER BY value DESC",
      (error, results) => {
        if (error) {
          console.log(error.message);
          response.status(500).json({
            error: "Failed to connect to the database or invalid query.",
          });
        } else {
          resultProcessor(response, error, results);
        }
        client.end();
      },
    );
  }
}

/**
 * @param {Response} response
 */
function expRanking(response: Response): void {
  const client = mysql.createReefSeichiConnection();

  /* eslint-disable indent */
  client.query(
    "SELECT `name`, `experience` AS value, `xuid` " +
    "FROM `USER` ORDER BY value DESC",
    (error, results) => {
      client.end();
      resultProcessor(response, error, results);
    },
  );
}

/**
 * @param {Response} response
 */
function moneyRanking(response: Response): void {
  const client = mysql.createReefSeichiConnection();

  /* eslint-disable indent */
  client.query(
    "SELECT u.xuid, u.name, m.money AS value FROM USER u JOIN MONEY m " +
    "ON u.xuid = m.xuid ORDER BY value DESC",
    (error, results) => {
      client.end();
      resultProcessor(response, error, results);
    },
  );
}

/**
 * @param {Response} response
 * @param {MysqlError} error
 * @param {Array} results
 */
function resultProcessor(response: Response, error: MysqlError | null,
  results: Array<{ xuid: number, value: number, name: string }>): void {
  if (error) {
    response.status(500).json({
      error: "Failed to connect to the database.",
    });
  } else {
    let realRank = 0;
    let rank = 0;
    let nowValue = 0;
    const ranking:
      { ranking: number; name: string; value: number; }[] = [];

    results.forEach((result:
      { xuid: number, value: number, name: string }) => {
      if (NOT_SHOW.includes(name)) return;

      realRank++;

      if (result.value !== nowValue) {
        rank = realRank;
        nowValue = result.value;
      }
      ranking.push({
        ranking: rank,
        name: result.name,
        value: result.value,
      });
    });
    response.status(200).json(ranking);
  }
}
