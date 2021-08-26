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

// // 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제
// exports.deleteOtherStore = async function (userId, storeId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   try {
//     await connection.beginTransaction();

//     const result = await cartDao.deleteOtherStore(connection, userId, storeId);

//     await connection.commit();

//     connection.release();
//     return result;
//   } catch (err) {
//     await connection.rollback();
//     connection.release();
//     logger.error(`Cart-deleteOtherStore Service error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 메뉴 수량 변경
exports.changeMenuAmount = async function (userId, rootId, amount) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.changeMenuAmount(
      connection,
      userId,
      rootId,
      amount
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-changeMenuAmount Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트 비우기
exports.cleanUpCart = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.cleanUpCart(connection, userId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-cleanUpCart Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 쿠폰 선택
exports.changeCoupon = async function (userId, couponObtainedId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.changeCoupon(
      connection,
      userId,
      couponObtainedId
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-changeCoupon Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 쿠폰 선택 제거
exports.deleteCouponChoice = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.deleteCouponChoice(connection, userId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-deleteCouponChoice Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 결제수단 변경
exports.changePayment = async function (userId, paymentId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.changePayment(connection, userId, paymentId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-changePayment Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 특정 메뉴 삭제
exports.deleteCartMenu = async function (userId, menuId, createdAt) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.deleteCartMenu(
      connection,
      userId,
      menuId,
      createdAt
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-deleteCartMenu Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
