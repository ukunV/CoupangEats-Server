const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storeProvider = require("./storeProvider");
const storeDao = require("./storeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 음식점 즐겨찾기 추가
exports.createStoreLike = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await storeDao.createStoreLike(connection, userId, storeId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Store-createStoreLike Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 즐겨찾기 삭제
exports.deleteStoreLike = async function (userId, storeIdArr) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await storeDao.deleteStoreLike(
      connection,
      userId,
      storeIdArr
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Store-deleteStoreLike Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
