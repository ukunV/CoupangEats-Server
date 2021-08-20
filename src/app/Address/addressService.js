const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const addressProvider = require("./addressProvider");
const addressDao = require("./addressDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주소 추가
exports.insertAddress = async function (
  userId,
  type,
  nickname,
  buildingName,
  address,
  detailAddress,
  information,
  lat,
  lng
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await addressDao.insertAddress(
      connection,
      userId,
      type,
      nickname,
      buildingName,
      address,
      detailAddress,
      information,
      lat,
      lng
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Address-insertAddress Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주소 수정
exports.updateAddress = async function (
  userId,
  type,
  nickname,
  buildingName,
  address,
  detailAddress,
  information,
  lat,
  lng,
  addressId
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await addressDao.updateAddress(
      connection,
      userId,
      type,
      nickname,
      buildingName,
      address,
      detailAddress,
      information,
      lat,
      lng,
      addressId
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Address-insertAddress Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주소 삭제
exports.deleteAddress = async function (addressId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await addressDao.deleteAddress(connection, addressId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Address-deleteAddress Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주소 목록에서 주소 선택
exports.updateLocation = async function (addressId, userId, lat, lng) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await addressDao.updateLocation(
      connection,
      addressId,
      userId,
      lat,
      lng
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Address-updateLocation Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
