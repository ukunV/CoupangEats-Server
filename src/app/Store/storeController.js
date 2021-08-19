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
 * path variable: categoryId
 */
exports.getNewStore = async function (req, res) {
  const { userId } = req.verifiedToken;
  const { categoryId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await storeProvider.checkUserExist(userId);

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
 * query string: ( page, size ), ( filter, cheetah, deliveryFee, minPrice, coupon )
 */
exports.getStoresByCategoryId = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { categoryId } = req.params;

  let { page, size } = req.query;

  const { filter, cheetah, deliveryFee, minPrice, coupon } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!page) return res.send(response(baseResponse.PAGE_IS_EMPTY)); // 2017

  if (!regPage.test(page))
    return res.send(response(baseResponse.PAGE_IS_NOT_VALID)); // 2018

  if (!size) return res.send(response(baseResponse.SIZE_IS_EMPTY)); // 2019

  if (!regSize.test(size))
    return res.send(response(baseResponse.SIZE_IS_NOT_VALID)); // 2020

  if ((coupon !== "0") & (coupon !== "1"))
    return res.send(response(baseResponse.COUPON_STATUS_IS_NOT_VALID)); // 2029

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

  let couponCondition;

  if (coupon === "1") couponCondition = "and c.discount is not null";
  else couponCondition = "";

  // Set Query Order Condition End

  const result = await storeProvider.selectStoresByCategoryId(
    userId,
    categoryCondition,
    page,
    size,
    filterCondition,
    cheetahCondition,
    deliveryFeeCondition,
    minPriceCondition,
    couponCondition
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 13
 * API Name : 음식점 상세페이지 조회 API
 * [GET] /stores/:storeId/store-detail
 * path variable: storeId
 */
exports.getStore = async function (req, res) {
  const { storeId } = req.params;

  // Response Error Start

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await storeProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  const result = await storeProvider.selectStore(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 14
 * API Name : 음식점 배달비 자세히 API
 * [GET] /stores/:storeId/delivery-detail
 * path variable: storeId
 */
exports.getStoreDelivery = async function (req, res) {
  const { storeId } = req.params;

  // Response Error Start

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await storeProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  const result = await storeProvider.selectStoreDelivery(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 15
 * API Name : 음식점 매장/원산지 정보 조회 API
 * [GET] /stores/:storeId/info-detail
 * path variable: storeId
 */
exports.getStoreInfo = async function (req, res) {
  const { storeId } = req.params;

  // Response Error Start

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await storeProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  const result = await storeProvider.selectStoreInfo(storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 18
 * API Name : 메인 메뉴 조회 API
 * [GET] /stores/:storeId/menu-detail
 * path variable: storeId
 * query string: menuId
 */
exports.getMainMenu = async function (req, res) {
  const { storeId } = req.params;

  const { menuId } = req.query;

  // Response Error Start

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await storeProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  const checkMenuExist = await storeProvider.checkMenuExist(menuId);

  if (checkMenuExist === 0)
    return res.send(response(baseResponse.MENU_IS_NOT_EXIST)); // 3011

  const checkMenuDeleted = await storeProvider.checkMenuDeleted(menuId);

  if (checkMenuDeleted === 0)
    return res.send(response(baseResponse.MENU_IS_DELETED)); // 3012

  // Response Error End

  const result = await storeProvider.selectMainMenu(menuId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 24
 * API Name : 음식점 즐겨찾기 추가 API
 * [POST] /stores/:storeId/store-like
 * path variable: storeId
 */
exports.createStoreLike = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await storeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkStoreExist = await storeProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await storeProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  const checkStoreLike = await storeProvider.checkStoreLike(userId, storeId);

  if (checkStoreLike === 1)
    return res.send(response(baseResponse.STORE_LIKE_ALREADY_EXIST)); // 3018

  // Response Error End

  const result = await storeService.createStoreLike(userId, storeId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 25
 * API Name : 음식점 즐겨찾기 삭제 API
 * [PATCH] /stores/store-like
 * path variable: storeId
 */
exports.deleteStoreLike = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeIdArr } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await storeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  for (let i = 0; i < storeIdArr.length; i++) {
    const checkStoreExist = await storeProvider.checkStoreExist(storeIdArr[i]);

    if (checkStoreExist === 0)
      return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

    const checkStoreDeleted = await storeProvider.checkStoreDeleted(
      storeIdArr[i]
    );

    if (checkStoreDeleted === 0)
      return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

    const checkStoreLike = await storeProvider.checkStoreLike(
      userId,
      storeIdArr[i]
    );

    if (checkStoreLike === 0)
      return res.send(response(baseResponse.STORE_LIKE_NOT_EXIST)); // 3019
  }

  // Response Error End

  const result = await storeService.deleteStoreLike(userId, storeIdArr);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 26
 * API Name : 즐겨찾기 목록 조회 API
 * [GET] /stores/store-like
 * query string: filter
 */
exports.getStoreLike = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { filter } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010
  if ((filter != 1) & (filter != 2) & (filter != 3) & (filter != ""))
    return res.send(errResponse(baseResponse.FILTER_IS_NOT_VALID)); // 2028

  // Request Error End

  // Response Error Start

  const checkUserExist = await storeProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  // Response Error End

  let filterCondition = "order by ";

  if (filter === "1") filterCondition += "ol.orderCount desc";
  else if (filter === "2") filterCondition += "ol.recentOrder desc";
  else if (filter === "3") filterCondition += "sl.createdAt desc";
  else filterCondition += "ol.orderCount desc";

  const result = await storeProvider.selectStoreLike(userId, filterCondition);

  return res.send(response(baseResponse.SUCCESS, result));
};
