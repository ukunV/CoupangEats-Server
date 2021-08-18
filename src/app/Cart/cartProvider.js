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

// 음식점 삭제 여부 check
exports.checkStoreDeleted = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkStoreDeleted(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkStoreDeleted Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

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

// 메뉴 삭제 여부 check
exports.checkMenuDeleted = async function (menuId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await cartDao.checkMenuDeleted(connection, menuId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Cart-checkMenuDeleted Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
