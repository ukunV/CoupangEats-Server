const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const addressDao = require("./addressDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주소 존재 여부 확인
exports.checkAddressExist = async function (addressId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.checkAddressExist(connection, addressId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-checkAddressExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주소 목록 조회
exports.selectAddress = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.selectAddress(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-selectAddress Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 집/회사 주소 존재 여부 확인
exports.checkHouseCompany = async function (userId, type) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.checkHouseCompany(connection, userId, type);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-checkHouseCompany Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 주소 삭제 여부 확인
// exports.checkAddressDeleted = async function (addressId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await addressDao.checkAddressDeleted(connection, addressId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Address-checkAddressDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await addressDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Address-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
