const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

const user_ctrl = require("../../../controllers/user_ctrl");

// Provider: Read 비즈니스 로직 처리

// 이메일 존재 여부 확인
exports.checkEmailExist = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEmailExist(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEmailExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전화번호 존재 여부 확인
exports.checkPhoneNumExist = async function (phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkPhoneNumExist(connection, phoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkPhoneNumExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀번호 확인
exports.checkPassword = async function (email, password) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const salt = await userDao.getSalt(connection, email);

    const hashedPassword = await user_ctrl.makePasswordHashed(salt, password);

    const params = [email, hashedPassword];
    const result = await userDao.checkPassword(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkPassword Provider error: ${err.message}`);
    return -1;
  }
};

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkUserExist(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 홈 화면 조회
exports.selectHome = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectHome(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectHome Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 이벤트 목록 조회
exports.selectEventList = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectEventList(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectEventList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
