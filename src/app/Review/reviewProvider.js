const { ExceptionHandler } = require("winston");
const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const reviewDao = require("./reviewDao");

// Provider: Read 비즈니스 로직 처리

// 유저 존재 여부 check
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUserExist(connection, userId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 음식점 존재 여부 check
exports.checkStoreExist = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkStoreExist(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkStoreExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 음식점 삭제 여부 check
// exports.checkStoreDeleted = async function (storeId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await reviewDao.checkStoreDeleted(connection, storeId);

//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`Review-checkStoreDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 최근 포토 리뷰 3개 조회
exports.selectPhotoReviews = async function (storeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.selectPhotoReviews(connection, storeId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-selectPhotoReviews Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 조회
exports.selectReviewList = async function (
  storeId,
  page,
  size,
  condition,
  photoCondition
) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.selectReviewList(
      connection,
      storeId,
      page,
      size,
      condition,
      photoCondition
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-selectReviewList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주문과 회원 일치 여부 check
exports.checkUsersOrder = async function (userId, orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUsersOrder(connection, userId, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkUsersOrder Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주문 존재 여부 check
exports.checkOrderExist = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkOrderExist(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkOrderExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 주문 취소 여부 check
exports.checkOrderDeleted = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkOrderDeleted(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkOrderDeleted Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 존재 여부 check by orderId
exports.checkReviewExistByOrderId = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkReviewExistByOrderId(
      connection,
      orderId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Review-checkReviewExistByOrderId Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 존재 여부 check by reviewId
exports.checkReviewExistByReviewId = async function (reviewId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkReviewExistByReviewId(
      connection,
      reviewId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `Review-checkReviewExistByReviewId Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 작성자 여부 check
exports.checkReviewHost = async function (userId, reviewId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkReviewHost(
      connection,
      userId,
      reviewId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkReviewHost Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 해당 유저가 이미 신고했는지 check
exports.checkAlreadyReport = async function (userId, reviewId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkAlreadyReport(
      connection,
      userId,
      reviewId
    );

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkAlreadyReport Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 내가 작성한 리뷰 조회
exports.selectMyReview = async function (orderId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.selectMyReview(connection, orderId);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-selectMyReview Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 확인
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 확인
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await reviewDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`Review-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
