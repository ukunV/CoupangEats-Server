const jwtMiddleware = require("../../../config/jwtMiddleware");
const cartProvider = require("../../app/Cart/cartProvider");
const cartService = require("../../app/Cart/cartService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const passport = require("passport");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// regular expression
const regAmount = /^[0-9]/;

/**
 * API No. 19
 * API Name : 카트에 담기 API
 * [POST] /carts/:storeId/menu
 * query string: menuId
 */
exports.createCarts = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId } = req.params;

  const { menuId } = req.query;

  const { amount, subIdArr } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!amount) return res.send(errResponse(baseResponse.AMOUNT_IS_EMPTY)); // 2023

  if (!regAmount.test(amount) | (amount < 1) | (amount > 100))
    return res.send(errResponse(baseResponse.AMOUNT_IS_NOT_VALID)); // 2024

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkStoreExist = await cartProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkMenuExist = await cartProvider.checkMenuExist(menuId);

  if (checkMenuExist === 0)
    return res.send(response(baseResponse.MENU_IS_NOT_EXIST)); // 3011

  for (let i = 0; i < subIdArr.length; i++) {
    const checkMenuExist = await cartProvider.checkMenuExist(subIdArr[i]);

    if (checkMenuExist === 0)
      return res.send(response(baseResponse.SUB_MENU_IS_NOT_EXIST)); // 3020
  }

  const checkOtherStoreExist = await cartProvider.checkOtherStoreExist(
    userId,
    storeId
  );

  if (checkOtherStoreExist === 1)
    return res.send(response(baseResponse.OTHER_STORE_EXIST)); // 3039

  // Response Error End

  const result = await cartService.createCart(
    userId,
    storeId,
    menuId,
    amount,
    subIdArr
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 20
 * API Name : 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제 API
 * [PATCH] /carts/:storeId/menu
 */
exports.deleteOtherStore = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkStoreExist = await cartProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkCartExist = await cartProvider.checkCartExist(userId);

  if (checkCartExist === 0)
    return res.send(response(baseResponse.CART_IS_EMPTY)); // 3013

  const checkSameStore = await cartProvider.checkSameStore(userId, storeId);

  if (checkSameStore === 1)
    return res.send(response(baseResponse.SAME_STORE_MENU)); // 3014

  // Response Error End

  const result = await cartService.deleteOtherStore(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 46
 * API Name : 메뉴 수량 변경 API
 * [PATCH] /carts/amount
 */
exports.changeMenuAmount = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { rootId, amount } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!rootId) return res.send(errResponse(baseResponse.ROOT_ID_IS_EMPTY)); // 2068

  if (!amount) return res.send(errResponse(baseResponse.AMOUNT_IS_EMPTY)); // 2023

  if (!regAmount.test(amount))
    return res.send(errResponse(baseResponse.AMOUNT_IS_NOT_VALID)); // 2024

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkMenuExistAtCart = await cartProvider.checkMenuExistAtCart(
    userId,
    rootId
  );

  if (checkMenuExistAtCart === 0)
    return res.send(response(baseResponse.MENU_IS_NOT_EXIST_AT_CART)); // 3040

  // Response Error End

  const result = await cartService.changeMenuAmount(userId, rootId, amount);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 47
 * API Name : 카트 비우기 API
 * [PATCH] /carts/clean-up
 */
exports.cleanUpCart = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  // Response Error End

  const result = await cartService.cleanUpCart(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};
