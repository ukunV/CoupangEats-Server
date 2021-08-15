const mysql = require("mysql2/promise");
const { logger } = require("./winston");

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
  host: "note-rds-soft-squared.ch1ke3pfbclp.ap-northeast-2.rds.amazonaws.com",
  user: "note",
  port: "3306",
  password: "note0827!",
  database: "CoupangEats",
});

module.exports = {
  pool: pool,
};
