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
    let jwtToken = req.headers.authorization.replace("Bearer ", "");
    const decoded = jwt.verify(jwtToken, serverRuntimeConfig.secret);

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

    const [rows, fields] = await connection.execute(
      "SELECT * FROM `users` WHERE discord_id=?",
      [decoded.user_id]
    );

    connection.end();

    if (rows.length > 0) return res.status(200).json(rows[0]);
    else return res.status(404).json();
  }
}
