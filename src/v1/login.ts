import * as admin from "firebase-admin";
import * as express from "express";
import * as basicAuth from "express-basic-auth";
import * as bcrypt from "bcrypt";

// eslint-disable-next-line new-cap
export const router = express.Router();

/* eslint-disable indent */
router.use(
  basicAuth({
    challenge: true,
    authorizer: authorizer,
    authorizeAsync: true,
    unauthorizedResponse: unauthorizedResponse,
  }),
  (request, response) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const token = admin.auth().createCustomToken("xuid:" + request.auth);
    response.status(200).json({token: token});
  },
);

/**
 * @param {string} user
 * @param {string} password
 * @param {basicAuth.AsyncAuthorizerCallback} callback
 */
function authorizer(user: string, password: string,
  callback: basicAuth.AsyncAuthorizerCallback) {
  admin.firestore().collection("users").doc(user).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      if (data && bcrypt.compareSync(password, data.password)) {
        callback(null, true);
      }
    }
    callback(null, false);
  });
}

/**
 * @param {express.Request} request
 * @param {express.Response} response
 */
function unauthorizedResponse(request: express.Request,
  response: express.Response) {
  response.status(401).json({error: "Unauthorized"});
}
