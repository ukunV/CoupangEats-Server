const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 유저 회원가입
exports.createUser = async function (
  email,
  salt,
  hashedPassword,
  name,
  phoneNum,
  lat,
  lng
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const params = [email, salt, hashedPassword, name, phoneNum, lat, lng];
    const result = await userDao.createUser(connection, params);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`User-createUser Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 유저 주소 변경
// exports.updateAddress = async function (lat, lng, userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   try {
//     await connection.beginTransaction();

//     const params = [lat, lng, userId];
//     const result = await userDao.updateAddress(connection, params);

//     await connection.commit();

//     connection.release();
//     return result;
//   } catch (err) {
//     await connection.rollback();
//     connection.release();
//     logger.error(`User-updateAddress Service error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 아이디 찾기 - 인증번호 전송 및 저장
exports.updateAuthNumByPhoneNum = async function (phoneNum, authNum) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await userDao.updateAuthNumByPhoneNum(
      connection,
      phoneNum,
      authNum
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`User-updateAuthNumByPhoneNum Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀번호 찾기 - 인증번호 전송 및 저장
exports.updateAuthNumByEmail = async function (email, authNum) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await userDao.updateAuthNumByEmail(
      connection,
      email,
      authNum
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`User-updateAuthNumByEmail Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀번호 찾기 - 인증번호 확인 및 비밀번호 재설정
exports.updatePassword = async function (hashedPassword, salt, email) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await userDao.updatePassword(
      connection,
      hashedPassword,
      salt,
      email
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`User-updatePassword Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
