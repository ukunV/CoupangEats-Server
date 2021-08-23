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

// 주문내역 조회
exports.selectOrderList = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.selectOrderList(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-selectOrderList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주문내역 존재 여부 check
exports.checkOrderExist = async function (userId, orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkOrderExist(connection, userId, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkOrderExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 영수증 조회
exports.selectOrderReceipt = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.selectOrderReceipt(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-selectOrderReceipt Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 배달 현황 조회
exports.getDeliveryStatus = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.getDeliveryStatus(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-getDeliveryStatus Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
