const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const paymentProvider = require("./paymentProvider");
const paymentDao = require("./paymentDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 결제방식(카드) 등록
exports.createCard = async function (
  userId,
  number,
  validMonth,
  validYear,
  cvc,
  pwd
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await paymentDao.createCard(
      connection,
      userId,
      number,
      validMonth,
      validYear,
      cvc,
      pwd
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Payment-createCard Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제방식(계좌) 등록
exports.createAccount = async function (userId, bankId, number) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await paymentDao.createAccount(
      connection,
      userId,
      bankId,
      number
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Payment-createAccount Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제방식 삭제
exports.deletePayment = async function (paymentId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await paymentDao.deletePayment(connection, paymentId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Payment-deletePayment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 현금영수증 발급 정보 변경
exports.modifyCashReceiptMethod = async function (
  userId,
  isGet,
  cashReceiptMethod,
  cashReceiptNum
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await paymentDao.modifyCashReceiptMethod(
      connection,
      userId,
      isGet,
      cashReceiptMethod,
      cashReceiptNum
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(
      `Payment-modifyCashReceiptMethod Service error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};
