const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const passport = require("passport");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

/**
 * API No. 32
 * API Name : 최근 포토 리뷰 3개 조회 API
 * [GET] /reviews/:storeId/photo-review
 * path variable: storeId
 */
exports.getPhotoReviews = async function (req, res) {
  const { storeId } = req.params;

  // Request Error Start

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  // Request Error End

  // Response Error Start

  const checkStoreExist = await reviewProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await reviewProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  const result = await reviewProvider.selectPhotoReviews(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 32
 * API Name : 리뷰 조회 API
 * [GET] /reviews/:storeId/review-list
 * path variable: storeId
 * query string: filter, photoFilter
 */
exports.getReviewList = async function (req, res) {
  const { storeId } = req.params;

  const { filter } = req.query;

  // Request Error Start

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if ((filter != 0) & (filter != 1) & (filter != ""))
    return res.send(errResponse(baseResponse.FILTER_IS_NOT_VALID)); // 2028

  // Request Error End

  // Response Error Start

  const checkStoreExist = await reviewProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await reviewProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  let onlyPhotoCondition;

  if (filter === "1") onlyPhotoCondition = "and isPhoto = 1";
  else onlyPhotoCondition = "";

  const result = await reviewProvider.selectReviewList(
    storeId,
    onlyPhotoCondition
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
