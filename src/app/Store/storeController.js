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
 * API No.
 * API Name : 음식 카테고리 목록 조회 API
 * [GET] /stores/food-category
 */
exports.getFoodCategory = async function (req, res) {
  const result = await storeProvider.getFoodCategory();

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No.
 * API Name : 카테고리별 음식점 조회 API
 * [GET] /stores/:categoryId
 * path variable: categoryId
 * query string: filter, cheetah, fee, min
 */
exports.getStoresbyCategoryId = async function (req, res) {
  const { categoryId } = req.params;
  const { filter, cheetah, fee, min } = req.query;

  const checkCategoryExists = await storeProvider.checkCategoryExists(
    categoryId
  );
};
