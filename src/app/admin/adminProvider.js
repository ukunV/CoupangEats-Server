const { ExceptionHandler } = require("winston");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const adminDao = require("./adminDao");

// Provider: Read 비즈니스 로직 처리

// 주문 배달완료 여부 check
exports.checkOrderAlive = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkOrderAlive(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkOrderAlive Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주문 상태 check (status = 1)
exports.checkOrderStatus = async function (orderId, status) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await orderDao.checkOrderStatus(connection, orderId, status);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Order-checkOrderStatus Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
