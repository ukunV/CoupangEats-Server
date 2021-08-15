const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

// Provider: Read 비즈니스 로직 처리

// 음식 카테고리 조회
exports.getFoodCategory = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await storeDao.selectFoodCategory(connection);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Store-getFoodCategory Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
