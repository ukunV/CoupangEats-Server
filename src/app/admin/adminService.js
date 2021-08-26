const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const adminProvider = require("./adminProvider");
const adminDao = require("./adminDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 주문 상태 변경(주문 수락됨)
exports.updateOrderStatus = async function (orderId, status) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await adminDao.updateOrderStatus(
      connection,
      orderId,
      status
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`admin-updateOrderStatus Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 라이더 위치 초기 세팅
exports.createRider = async function (storeId, orderId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await adminDao.createRider(connection, storeId, orderId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`admin-createRider Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 라이더 위치 갱신
exports.updateRider = async function (orderId, lat, lng) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await adminDao.updateRider(connection, orderId, lat, lng);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Order-updateRider Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
