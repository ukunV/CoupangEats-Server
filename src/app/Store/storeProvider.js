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

// 새로 들어왔어요 목록 조회
exports.selectNewStore = async function (userId, categoryId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const params = [userId, categoryId];
    const result = await storeDao.selectNewStore(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-selectNewStore Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 조회 by categoryId
exports.selectStoresByCategoryId = async function (
  userId,
  categoryCondition,
  page,
  size,
  filterCondition,
  cheetahCondition,
  deliveryFeeCondition,
  minPriceCondition
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectStoresByCategoryId(
      connection,
      userId,
      categoryCondition,
      page,
      size,
      filterCondition,
      cheetahCondition,
      deliveryFeeCondition,
      minPriceCondition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Store-selectStoresByCategoryId Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};
