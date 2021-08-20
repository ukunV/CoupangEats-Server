const { logger } = require("../../../config/winston");
const { pool } = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const { response } = require("../../../config/response");
const { errResponse } = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { connect } = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

// 리뷰 작성
exports.createReview = async function (
  userId,
  orderId,
  imageURL,
  contents,
  point
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await reviewDao.createReview(
      connection,
      userId,
      orderId,
      imageURL,
      contents,
      point
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Review-createReview Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 삭제
exports.deleteReview = async function (reviewId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await reviewDao.deleteReview(connection, reviewId);

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Review-deleteReview Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 신고
exports.reportReview = async function (
  userId,
  reviewId,
  selectReasonArr,
  commentReason
) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await reviewDao.reportReview(
      connection,
      userId,
      reviewId,
      selectReasonArr,
      commentReason
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Review-reportReview Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 리뷰 수정
exports.modifyReview = async function (reviewId, point, contents, imageURL) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    await connection.beginTransaction();

    const result = await reviewDao.modifyReview(
      connection,
      reviewId,
      point,
      contents,
      imageURL
    );

    await connection.commit();

    connection.release();
    return result;
  } catch (err) {
    await connection.rollback();
    connection.release();
    logger.error(`Review-modifyReview Service error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
