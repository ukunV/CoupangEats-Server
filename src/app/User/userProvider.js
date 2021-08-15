const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

// 이메일 존재 여부 확인
exports.checkEmailExists = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEmailExists(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEmailExists Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전화번호 존재 여부 확인
exports.checkPhoneNumExists = async function (phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkPhoneNumExists(connection, phoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkPhoneNumExists Provider error\n: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
