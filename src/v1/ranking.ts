import * as express from "express";
import {Response} from "express";
import * as mysql from "./mysql";

// eslint-disable-next-line new-cap
export const router = express.Router();

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
  const client = mysql.createConnection(mysql.database.CORAL_REEF);

  /* eslint-disable indent */
  client.query(
    "SELECT `name`, `experience`, `xuid` " +
    "FROM `USER` ORDER BY `experience` DESC",
    (error, results) => {
      if (error) {
        response.status(500).json({
          error: "Failed to connect to the database.",
        });
      } else {
        let realRank = 0;
        let rank = 0;
        let nowExp = 0;
        const ranking:
          { ranking: number; name: string; experience: number; }[] = [];

        results.forEach((result:
          { name: string, experience: number, xuid: number }) => {
          if (result.xuid === 0) return;
          realRank++;

          if (result.experience !== nowExp) {
            rank = realRank;
            nowExp = result.experience;
          }
          ranking.push({
            ranking: rank,
            name: result.name,
            experience: result.experience,
          });
        });
        response.status(200).json(ranking);
      }
      client.end();
    },
  );
}

/**
 * @param {Response} response
 */
function moneyRanking(response: Response): void {
  const client = mysql.createConnection(mysql.database.CORAL_REEF);

  /* eslint-disable indent */
  client.query(
    "SELECT u.xuid, u.name, m.money FROM USER u JOIN MONEY m " +
    "ON u.xuid = m.xuid ORDER BY m.money DESC",
    (error, results) => {
      if (error) {
        response.status(500).json({
          error: "Failed to connect to the database.",
        });
      } else {
        let realRank = 0;
        let rank = 0;
        let nowMoney = 0;
        const ranking:
          { ranking: number; name: string; money: number; }[] = [];

        results.forEach((result:
          { xuid: number, money: number, name: string }) => {
          realRank++;

          if (result.money !== nowMoney) {
            rank = realRank;
            nowMoney = result.money;
          }
          ranking.push({
            ranking: rank,
            name: result.name,
            money: result.money,
          });
        });
        response.status(200).json(ranking);
      }
      client.end();
    },
  );
}
