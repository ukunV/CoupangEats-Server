const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const orderProvider = require("./orderProvider");
const orderDao = require("./orderDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주문 정보 생성
exports.createOrder = async function (
  userId,
  storeId,
  paymentId,
  deliveryFee,
  discount,
  finalPrice
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await orderDao.createOrder(
      connection,
      userId,
      storeId,
      paymentId,
      deliveryFee,
      discount,
      finalPrice
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Order-createOrder Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
