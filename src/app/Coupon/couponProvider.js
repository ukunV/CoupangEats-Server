const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const couponDao = require("./couponDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 존재 여부 check
exports.checkStoreExist = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkStoreExist(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 음식점 삭제 여부 check
// exports.checkStoreDeleted = async function (storeId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await couponDao.checkStoreDeleted(connection, storeId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Coupon-checkStoreDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// My 이츠에서 쿠폰 목록 조회
exports.selectMyEatsCoupons = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.selectMyEatsCoupons(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-selectMyEatsCoupons Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 쿠폰 목록 조회
exports.selectCartCoupons = async function (userId, storeId, totalPrice) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.selectCartCoupons(
      connection,
      userId,
      storeId,
      totalPrice
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-selectCartCoupons Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 쿠폰 존재 여부 check
exports.checkCouponExist = async function (number) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkCouponExist(connection, number);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkCouponExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 쿠폰 만료 여부 check
exports.checkCouponAlive = async function (number) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkCouponAlive(connection, number);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkCouponAlive Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 쿠폰 소지 여부 check
exports.checkCouponObtained = async function (userId, number) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkCouponObtained(
      connection,
      userId,
      number
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkCouponObtained Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await couponDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Coupon-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
