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
