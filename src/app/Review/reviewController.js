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

// regular expression
const regPage = /^[0-9]/;
const regSize = /^[0-9]/;

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
 * query string: (page, size), (filter, photoFilter)
 */
exports.getReviewList = async function (req, res) {
  const { storeId } = req.params;

  let { page, size } = req.query;

  const { filter, photoFilter } = req.query;

  // Request Error Start

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if ((photoFilter != 0) & (photoFilter != 1) & (photoFilter != ""))
    return res.send(errResponse(baseResponse.PHOTO_FILTER_IS_NOT_VALID)); // 2036

  if (
    (filter != 1) &
    (filter != 2) &
    (filter != 3) &
    (filter != 4) &
    (filter != "")
  )
    return res.send(errResponse(baseResponse.FILTER_IS_NOT_VALID)); // 2028

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2017

  if (!regPage.test(page))
    return res.send(response(baseResponse.PAGE_IS_NOT_VALID)); // 2018

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2019

  if (!regSize.test(size))
    return res.send(response(baseResponse.SIZE_IS_NOT_VALID)); // 2020

  // Request Error End

  page = size * (page - 1);

  // Response Error Start

  const checkStoreExist = await reviewProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await reviewProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  let condition = "order by ";

  if (filter === "1") condition += "r.createdAt desc";
  else if (filter === "2") condition += "rlc.count desc, r.createdAt desc";
  else if (filter === "3") condition += "r.point desc, r.createdAt desc";
  else if (filter === "4") condition += "r.point asc, r.createdAt desc";
  else condition += "r.createdAt desc";

  let photoCondition;

  if (photoFilter === "1") photoCondition = "and isPhoto = 1";
  else photoCondition = "";

  const result = await reviewProvider.selectReviewList(
    storeId,
    page,
    size,
    condition,
    photoCondition
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
