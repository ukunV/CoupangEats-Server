const { ExceptionHandler } = require("winston");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const orderDao = require("./orderDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제수단 존재 여부 check
exports.checkPaymentExist = async function (userId, paymentId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkPaymentExist(
      connection,
      userId,
      paymentId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkPaymentExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 쿠폰 존재 여부 check
exports.checkCouponExist = async function (userId, couponObtainedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkCouponExist(
      connection,
      userId,
      couponObtainedId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkCouponExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
