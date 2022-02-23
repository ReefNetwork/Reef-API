import * as functions from "firebase-functions";
import * as mysql from "mysql";

export const database = {
  CORAL_REEF: "s20_CORAL_REEF",
};

/**
 * @param {string} database
 * @return {mysql.Connection} connection
 */
export function createConnection(database: string): mysql.Connection {
  return mysql.createConnection({
    host: functions.config().mysql.host,
    user: functions.config().mysql.user,
    password: functions.config().mysql.pass,
    database: database,
  });
}
