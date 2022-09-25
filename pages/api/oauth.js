const jwt = require("jsonwebtoken");
import { serialize } from "cookie";
import getConfig from "next/config";
import { apiHandler } from "helpers/api";
import axios from "axios";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const mysql = require("mysql2/promise");

export default apiHandler(handler);

function handler(req, res) {
  switch (req.method) {
    case "GET":
      return authenticate();
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  async function authenticate() {
    const { code = null, error = null } = req.query;

    if (error) {
      return res.redirect(`/?error=${req.query.error}`);
    }

    const REDIRECT_URI = publicRuntimeConfig.apiUrl + "/oauth";
    const OAUTH_QS = new URLSearchParams({
      client_id: serverRuntimeConfig.CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      scope: "identify guilds",
    }).toString();

    const OAUTH_URI = `https://discord.com/api/oauth2/authorize?${OAUTH_QS}`;

    if (!code || typeof code !== "string") return res.redirect(OAUTH_URI);

    const body = new URLSearchParams({
      client_id: serverRuntimeConfig.CLIENT_ID,
      client_secret: serverRuntimeConfig.CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
      code,
      scope: "identify guilds",
    }).toString();

    const { access_token, token_type, expires_in, error_description } =
      await axios
        .post("https://discord.com/api/oauth2/token", body, {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        })
        .then((res) => res.data)
        .catch((ex) => ex.response.data);

    if (error_description == 'Invalid "code" in request.')
      return res.redirect(OAUTH_URI);

    console.log(access_token);
    console.log(token_type);
    console.log(expires_in);

    const { id, avatar, username } = await axios
      .get("http://discord.com/api/users/@me", {
        headers: { Authorization: `${token_type} ${access_token}` },
      })
      .then((res) => res.data);

    // const connection = await mysql.createConnection({
    //   host: "localhost",
    //   user: "root",
    //   password: "",
    //   database: "collabify",
    // });

    const connection = await mysql.createConnection({
      host: "nftmarketcap-mysql.mysql.database.azure.com",
      user: "nftmarketcap_admin",
      password: "5f3&WX24YY9$",
      database: "collabify",
      ssl: {
        rejectUnauthorized: false,
      },
    });


    let [rows, fields] = await connection.execute(
      "SELECT * FROM `users` WHERE discord_id=?",
      [id]
    );

    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours() + 2);

    if (rows.length > 0) {
      [rows, fields] = await connection.execute(
        "UPDATE `users` SET `username`=?,`discord_avatar_id`=?,`last_login`=? WHERE discord_id=?",
        [username, avatar, currentDate, id]
      );
    } else {
      [rows, fields] = await connection.execute(
        "INSERT INTO `users`(`id`, `username`, `discord_id`, `collab_manager`, `discord_avatar_id`, `twitter_handle`, `created_date`, `last_login`) VALUES (?,?,?,?,?,?,?,?)",
        [null, username, id, avatar, null, currentDate, currentDate]
      );
    }

    connection.end();

    const token = jwt.sign(
      {
        user_id: id,
        avatar_url: avatar,
        username,
      },
      serverRuntimeConfig.secret,
      {
        expiresIn: expires_in,
      }
    );

    res.setHeader(
      "Set-Cookie",
      serialize(
        "user",
        JSON.stringify({ token, user_id: id, avatar_url: avatar, username }),
        {
          secure: process.env.NODE_ENV !== "development",
          sameSite: "lax",
          path: "/",
        }
      )
    );

    console.log('redirect');
    return res.redirect("/");
  }
}
