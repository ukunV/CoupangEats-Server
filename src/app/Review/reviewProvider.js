const { ExceptionHandler } = require("winston");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 존재 여부 check
exports.checkStoreExist = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkStoreExist(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 삭제 여부 check
exports.checkStoreDeleted = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkStoreDeleted(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkStoreDeleted Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
