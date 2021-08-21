const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const cartProvider = require("./cartProvider");
const cartDao = require("./cartDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 카트에 담기
exports.createCart = async function (
  userId,
  storeId,
  menuId,
  amount,
  subIdArr
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.createCart(
      connection,
      userId,
      storeId,
      menuId,
      amount,
      subIdArr
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-createCart Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제
exports.deleteOtherStore = async function (userId, storeId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.deleteOtherStore(connection, userId, storeId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-deleteOtherStore Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
