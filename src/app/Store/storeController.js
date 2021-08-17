const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/Store/storeProvider");
const storeService = require("../../app/Store/storeService");
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
 * API No. 10
 * API Name : 음식 카테고리 목록 조회 API
 * [GET] /stores/food-category
 */
exports.getFoodCategory = async function (req, res) {
  const result = await storeProvider.selectFoodCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 11
 * API Name : 새로 들어왔어요 목록 조회 API
 * 카테고리로 조회 시 (쿠팡이츠에 등록된지 30일 이하)
 * [GET] /stores/:categoryId/new-store
 */
exports.getNewStore = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { categoryId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = storeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkCategoryExist = await storeProvider.checkCategoryExist(categoryId);

  if (checkCategoryExist === 0)
    return res.send(response(baseResponse.CATEGORY_NOT_EXIST)); // 3005

  // Response Error End

  const result = await storeProvider.selectNewStore(userId, categoryId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 12
 * API Name : 음식점 조회 by categoryId API
 * [GET] /stores/:categoryId/list
 * categoryId: 0 = 골라먹는 맛집
 * path variable: categoryId
 * query string: ( page, size ), ( filter, cheetah, deliveryFee, minPrice )
 */
exports.getStoresByCategoryId = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { categoryId } = req.params;

  let { page, size } = req.query;

  const { filter, cheetah, deliveryFee, minPrice } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2017

  if (!regPage.test(page))
    return res.send(response(baseResponse.PAGE_IS_NOT_VALID)); // 2018

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2019

  if (!regSize.test(size))
    return res.send(response(baseResponse.SIZE_IS_NOT_VALID)); // 2020

  // Request Error End

  page = size * (page - 1);

  // Response Error Start

  const checkCategoryExist = await storeProvider.checkCategoryExist(categoryId);

  if ((checkCategoryExist === 0) & (categoryId !== "0"))
    return res.send(response(baseResponse.CATEGORY_NOT_EXIST)); // 3005

  // Response Error End

  // Set Query Order Condition Start

  let categoryCondition = "";

  if (categoryId === "0") categoryCondition = "";
  else if (categoryId === "1")
    categoryCondition = "and timestampdiff(day, s.createdAt, now()) <= 30";
  else categoryCondition += `and s.categoryId = ${categoryId}`;

  let filterCondition = "order by ";

  if (filter === "1") filterCondition += "oc.count desc";
  else if (filter === "2") filterCondition += "reviewCount desc";
  else if (filter === "3") filterCondition += "distance";
  else if (filter === "4") filterCondition += "avgPoint desc";
  else if (filter === "5") filterCondition += "s.createdAt desc";
  else filterCondition += "oc.count desc";

  let cheetahCondition = "and s.isCheetah = ";

  if (!cheetah || cheetah === "0") cheetahCondition = "";
  else cheetahCondition += "1";

  let deliveryFeeCondition = "and sdp.price <= ";

  if (deliveryFee === "3000") deliveryFeeCondition = "3000";
  else if (deliveryFee === "2000") deliveryFeeCondition = "2000";
  else if (deliveryFee === "1000") deliveryFeeCondition = "1000";
  else if (deliveryFee === "0") deliveryFeeCondition = "and sdp.price = 0";
  else deliveryFeeCondition = "";

  let minPriceCondition = "and sdp.orderPrice <= ";

  if (minPrice === "15000") minPriceCondition = "15000";
  else if (minPrice === "12000") minPriceCondition = "12000";
  else if (minPrice === "10000") minPriceCondition = "10000";
  else if (minPrice === "5000") minPriceCondition = "5000";
  else minPriceCondition = "";

  // Set Query Order Condition End

  const result = await storeProvider.selectStoresByCategoryId(
    userId,
    categoryCondition,
    page,
    size,
    filterCondition,
    cheetahCondition,
    deliveryFeeCondition,
    minPriceCondition
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 13
 * API Name : 음식점 상세페이지 조회 API
 * [GET] /stores/:storeId/store-detail
 */
exports.getStore = async function (req, res) {
  const { storeId } = req.params;

  // Response Error Start

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3005

  // Response Error End

  const result = await storeProvider.selectStore(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};
