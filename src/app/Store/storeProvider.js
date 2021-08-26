const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

// Provider: Read 비즈니스 로직 처리

// 음식 카테고리 조회
exports.selectFoodCategory = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectFoodCategory(connection);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectFoodCategory Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 카테고리 존재 여부 check
exports.checkCategoryExist = async function (categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkCategoryExist(connection, categoryId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkCategoryExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 새로 들어왔어요 목록 조회 by userId
exports.selectNewStoreByUserId = async function (userId, categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const params = [userId, categoryId];
    const result = await storeDao.selectNewStoreByUserId(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectNewStoreByUserId Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 새로 들어왔어요 목록 조회 by address
exports.selectNewStoreByAddress = async function (lat, lng, categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectNewStoreByAddress(
      connection,
      lat,
      lng,
      categoryId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Store-selectNewStoreByAddress Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 조회 by categoryId and userId
exports.selectStoresByCategoryIdAndUserId = async function (
  userId,
  categoryCondition,
  page,
  size,
  filterCondition,
  cheetahCondition,
  deliveryFeeCondition,
  minPriceCondition,
  couponCondition
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoresByCategoryIdAndUserId(
      connection,
      userId,
      categoryCondition,
      page,
      size,
      filterCondition,
      cheetahCondition,
      deliveryFeeCondition,
      minPriceCondition,
      couponCondition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Store-selectStoresByCategoryIdAndUserId Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 조회 by categoryId and address
exports.selectStoresByCategoryIdAndAddress = async function (
  lat,
  lng,
  categoryCondition,
  page,
  size,
  filterCondition,
  cheetahCondition,
  deliveryFeeCondition,
  minPriceCondition,
  couponCondition
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoresByCategoryIdAndAddress(
      connection,
      lat,
      lng,
      categoryCondition,
      page,
      size,
      filterCondition,
      cheetahCondition,
      deliveryFeeCondition,
      minPriceCondition,
      couponCondition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Store-selectStoresByCategoryIdAndAddress Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 존재 여부 check
exports.checkStoreExist = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkStoreExist(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 상세페이지 조회
exports.selectStore = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStore(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectStore Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 배달비 자세히
exports.selectStoreDelivery = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoreDelivery(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectStoreDelivery Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 매장/원산지 정보 조회
exports.selectStoreInfo = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoreInfo(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectStoreInfo Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 음식점 삭제 여부 check
// exports.checkStoreDeleted = async function (storeId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await storeDao.checkStoreDeleted(connection, storeId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Store-checkStoreDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 메뉴 존재 여부 check
exports.checkMenuExist = async function (menuId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkMenuExist(connection, menuId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkMenuExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 메인 메뉴 조회 check
exports.selectMainMenu = async function (menuId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectMainMenu(connection, menuId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectMainMenu Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 메뉴 삭제 여부 check
// exports.checkMenuDeleted = async function (menuId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await storeDao.checkMenuDeleted(connection, menuId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Store-checkMenuDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 이미 좋아요 클릭 여부 check
exports.checkStoreLike = async function (userId, storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkStoreLike(connection, userId, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkStoreLike Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 즐겨찾기 목록 조회
exports.selectStoreLike = async function (userId, filterCondition) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoreLike(
      connection,
      userId,
      filterCondition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectStoreLike Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
