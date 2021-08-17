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
 * API No. 1
 * API Name : 음식점 조회 API
 * [GET] /stores/:categoryId/list
 * path variable: categoryId
 * query string: filter, cheetah, fee, min
 */
exports.getStoresbyCategoryId = async function (req, res) {
  const { categoryId } = req.params;
  const { filter, cheetah, fee, min } = req.query;

  // Response Error Start

  const checkCategoryExist = await storeProvider.checkCategoryExist(categoryId);

  if (checkCategoryExist === 0)
    return res.send(response(baseResponse.CATEGORY_NOT_EXIST)); // 3005

  // Response Error End

  let filterCondition = "order by ";

  switch (filter) {
    case "1": // 가까운순
      filterCondition += "";
      break;
    case "2": // 별점높은순
      filterCondition += "";
      break;
    case "3": // 신규매장순
      filterCondition += "";
      break;
    default:
      // 주문많은순
      filterCondition += "";
      break;
  }
};
