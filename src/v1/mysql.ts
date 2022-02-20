import * as functions from "firebase-functions";
import * as mysql from "mysql";

export const client = mysql.createConnection({
  host: functions.config().mysql.host,
  user: functions.config().mysql.user,
  password: functions.config().mysql.pass,
});
