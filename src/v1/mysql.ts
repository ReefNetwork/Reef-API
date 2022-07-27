import * as functions from "firebase-functions";
import * as mysql from "mysql";

export const database = {
  CORAL_REEF: "reef_seichi",
  REEF_SERVER: "reef_server",
};

/**
 * @return {mysql.Connection} connection
 */
export function createReefSeichiConnection(): mysql.Connection {
  return mysql.createConnection({
    host: functions.config().mysql.reef_seichi.host,
    user: functions.config().mysql.reef_seichi.user,
    password: functions.config().mysql.reef_seichi.pass,
    database: database.CORAL_REEF,
  });
}

/**
 * @return {mysql.Connection} connection
 */
export function createReefServerConnection(): mysql.Connection {
  return mysql.createConnection({
    host: functions.config().mysql.reef_server.host,
    user: functions.config().mysql.reef_server.user,
    password: functions.config().mysql.reef_server.pass,
    database: database.REEF_SERVER,
  });
}
