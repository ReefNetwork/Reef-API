import * as functions from "firebase-functions";
import * as mysql from "mysql";

export const database = {
  CORAL_REEF: "s2802_CORAL_REEF",
  REEF_SERVER: "s2802_REEF_SERVER",
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

/**
 * @return {mysql.Connection} connection
 */
export function createReefServerConnection(): mysql.Connection {
  return mysql.createConnection({
    host: functions.config().mysql.host,
    user: functions.config().mysql.reef_server.user,
    password: functions.config().mysql.reef_server.pass,
    database: database.REEF_SERVER,
  });
}
