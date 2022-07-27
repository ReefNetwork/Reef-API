import {Response, Router} from "express";
import * as mysql from "./mysql";
import {MysqlError} from "mysql";

// eslint-disable-next-line new-cap
export const router = Router();

router.get("/", (request, response) => {
  const type = request.query.type;
  switch (type) {
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
