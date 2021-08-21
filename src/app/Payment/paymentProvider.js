const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const paymentDao = require("./paymentDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await paymentDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`payment-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
