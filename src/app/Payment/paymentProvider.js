const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const paymentDao = require("./paymentDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제방식(계좌) 등록 - 입금주명(유저명) 조회
exports.selectUserNameAtAccount = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.selectUserNameAtAccount(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Payment-selectUserNameAtAccount Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 은행 존재 여부 check
exports.checkBankExist = async function (bankId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkBankExist(connection, bankId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkBankExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 은행의 계좌번호 길이 check
exports.checkAccountLength = async function (bankId, numLen) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkAccountLength(
      connection,
      bankId,
      numLen
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkAccountLength Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제방식 존재 여부 check
exports.checkPaymentExist = async function (paymentId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkPaymentExist(connection, paymentId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkPaymentExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 해당 유저의 결제방식이 맞는지 check
exports.checkPaymentHost = async function (userId, paymentId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkPaymentHost(
      connection,
      userId,
      paymentId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkPaymentHost Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 현금영수증 발급 정보 조회
exports.selectCashReceiptInfo = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.selectCashReceiptInfo(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Payment-selectCashReceiptInfo Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제 관리 페이지 조회
exports.selectPayment = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.selectPayment(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-selectPayment Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계좌 은행 목록 조회
exports.selectBankList = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.selectBankList(connection);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Payment-selectBankList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
