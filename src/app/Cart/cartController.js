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
const regPrice = /^[0-9]/;

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

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

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

// /**
//  * API No. 20
//  * API Name : 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제 API
//  * [PATCH] /carts/:storeId/menu
//  */
// exports.deleteOtherStore = async function (req, res) {
//   const { userId } = req.verifiedToken;

//   const { storeId } = req.params;

//   // Request Error Start

//   if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

//   // Request Error End

//   // Response Error Start

//   const checkUserExist = await cartProvider.checkUserExist(userId);

//   if (checkUserExist === 0)
//     return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

//   const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

//   if (checkUserBlocked === 1)
//     return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

//   const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

//   if (checkUserWithdrawn === 1)
//     return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

//   const checkStoreExist = await cartProvider.checkStoreExist(storeId);

//   if (checkStoreExist === 0)
//     return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

//   const checkCartExist = await cartProvider.checkCartExist(userId);

//   if (checkCartExist === 0)
//     return res.send(response(baseResponse.CART_IS_EMPTY)); // 3013

//   const checkSameStore = await cartProvider.checkSameStore(userId, storeId);

//   if (checkSameStore === 1)
//     return res.send(response(baseResponse.SAME_STORE_MENU)); // 3014

//   // Response Error End

//   const result = await cartService.deleteOtherStore(userId);

//   return res.send(response(baseResponse.SUCCESS, result));
// };

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

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

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

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await cartService.cleanUpCart(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 48
 * API Name : 카트 조회 API
 * [GET] /carts/detail
 */
exports.getCart = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await cartProvider.selectCart(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 49
 * API Name : 카트 배달비 조회 API
 * [GET] /carts/detail/delivery-fee
 * query string: storeId, totalPrice
 */
exports.getCartDeliveryFee = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId, totalPrice } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (!totalPrice)
    return res.send(errResponse(baseResponse.TOTAL_PRICE_IS_EMPTY)); // 2069

  if (!regPrice.test(totalPrice))
    return res.send(errResponse(baseResponse.TOTAL_PRICE_IS_NOT_VALID)); // 2070

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkStoreExist = await cartProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  // Response Error End

  const result = await cartProvider.selectCartDeliveryFee(storeId, totalPrice);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 50
 * API Name : 카트 최대 할인 쿠폰 조회 API
 * [GET] /carts/detail/coupon
 * query string: storeId, totalPrice
 */
exports.getCartCoupon = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId, totalPrice } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (!totalPrice)
    return res.send(errResponse(baseResponse.TOTAL_PRICE_IS_EMPTY)); // 2069

  if (!regPrice.test(totalPrice))
    return res.send(errResponse(baseResponse.TOTAL_PRICE_IS_NOT_VALID)); // 2070

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkStoreExist = await cartProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  // Response Error End

  const result = await cartProvider.selectCartCoupon(
    userId,
    storeId,
    totalPrice
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 51
 * API Name : 카트에서 쿠폰 선택 API
 * [PATCH] /carts/detail/coupon-choice
 */
exports.changeCoupon = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { couponObtainedId } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!couponObtainedId)
    return res.send(errResponse(baseResponse.COUPON_ID_IS_EMPTY)); // 2071

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkCouponObtainedExist = await cartProvider.checkCouponObtainedExist(
    userId,
    couponObtainedId
  );

  if (checkCouponObtainedExist === 0)
    return res.send(response(baseResponse.COUPON_NOT_OBTAIN)); // 3041

  // Response Error End

  const result = await cartService.changeCoupon(userId, couponObtainedId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 52
 * API Name : 카트에서 선택한 쿠폰 조회 API
 * [GET] /carts/detail/coupon-choice
 */
exports.getCouponChoice = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await cartProvider.selectCouponChoice(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 53
 * API Name : 카트에서 쿠폰 선택 제거 API
 * [PATCH] /carts/detail/coupon
 */
exports.deleteCouponChoice = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await cartService.deleteCouponChoice(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 55
 * API Name : 카트에서 결제수단 변경 API
 * [PATCH] /carts/detail/payment-choice
 */
exports.changePayment = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { paymentId } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!paymentId)
    return res.send(errResponse(baseResponse.PAYMENT_ID_IS_EMPTY)); // 2062

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkPaymentExist = await cartProvider.checkPaymentExist(
    userId,
    paymentId
  );

  if (checkPaymentExist === 0)
    return res.send(errResponse(baseResponse.PAYMENT_IS_NOT_EXIST)); // 3037

  // Response Error End

  const result = await cartService.changePayment(userId, paymentId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 67
 * API Name : 카트에서 특정 메뉴 삭제 API
 * [PATCH] /carts/menu
 */
exports.deleteCartMenu = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { menuId, createdAt } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!menuId) return res.send(errResponse(baseResponse.MENU_ID_IS_EMPTY)); // 2033

  // Request Error End

  // Response Error Start

  const checkUserExist = await cartProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(response(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await cartProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await cartProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkMenuExist = await cartProvider.checkMenuExist(menuId);

  if (checkMenuExist === 0)
    return res.send(errResponse(baseResponse.MENU_IS_NOT_EXIST)); // 3011

  // Response Error End

  const result = await cartService.deleteCartMenu(userId, menuId, createdAt);

  return res.send(response(baseResponse.SUCCESS, result));
};
