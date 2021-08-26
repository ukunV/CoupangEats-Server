const { ExceptionHandler } = require("winston");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const cartDao = require("./cartDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 존재 여부 check
exports.checkStoreExist = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkStoreExist(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 음식점 삭제 여부 check
// exports.checkStoreDeleted = async function (storeId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await cartDao.checkStoreDeleted(connection, storeId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Cart-checkStoreDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 메뉴 존재 여부 check
exports.checkMenuExist = async function (menuId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkMenuExist(connection, menuId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkMenuExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 메뉴 삭제 여부 check
// exports.checkMenuDeleted = async function (menuId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await cartDao.checkMenuDeleted(connection, menuId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Cart-checkMenuDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 카트 상태 check
exports.checkCartExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkCartExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkCartExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 같은 음식점의 메뉴 여부 check
exports.checkSameStore = async function (userId, storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkSameStore(connection, userId, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkSameStore Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에 다른 상점이 이미 있는지 check
exports.checkOtherStoreExist = async function (userId, storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkOtherStoreExist(
      connection,
      userId,
      storeId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkOtherStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에 메뉴 존재 여부 check
exports.checkMenuExistAtCart = async function (userId, rootId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkMenuExistAtCart(
      connection,
      userId,
      rootId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkMenuExistAtCart Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트 조회
exports.selectCart = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.selectCart(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-selectCart Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트 배달비 조회
exports.selectCartDeliveryFee = async function (storeId, totalPrice) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.selectCartDeliveryFee(
      connection,
      storeId,
      totalPrice
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-selectCartDeliveryFee Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트 최대 할인 쿠폰 조회
exports.selectCartCoupon = async function (userId, storeId, totalPrice) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await cartDao.selectCartCoupon(
      connection,
      userId,
      storeId,
      totalPrice
    );

    await connection.commit();

    connection.release();

    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Cart-selectCartCoupon Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 쿠폰 획득 여부 check
exports.checkCouponObtainedExist = async function (userId, couponObtainedId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkCouponObtainedExist(
      connection,
      userId,
      couponObtainedId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Cart-checkCouponObtainedExist Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카트에서 선택한 쿠폰 조회
exports.selectCouponChoice = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.selectCouponChoice(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-selectCouponChoice Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 결제수단 존재 여부 check
exports.checkPaymentExist = async function (userId, paymentId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkPaymentExist(
      connection,
      userId,
      paymentId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkPaymentExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
