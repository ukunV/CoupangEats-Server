const jwtMiddleware = require("../../../config/jwtMiddleware");
const couponProvider = require("../../app/Coupon/couponProvider");
const couponService = require("../../app/Coupon/couponService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const kakaoMap = require("../../../controllers/kakao_ctrl").getAddressInfo;

// regular expression
const regPrice = /^[0-9]/;

/**
 * API No. 21
 * API Name : My 이츠에서 쿠폰 목록 조회 API
 * [GET] /coupons/my-eats/coupon-list
 */
exports.getMyEatsCoupons = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = couponProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  // Response Error End

  const result = await couponProvider.selectMyEatsCoupons(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 22
 * API Name : 카트에서 쿠폰 목록 조회 API
 * [GET] /coupons/cart/coupon-list
 * query string: storeId, totalPrice(format 해제하고 받아야함)
 */
exports.getCartCoupons = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId, totalPrice } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (!totalPrice)
    return res.send(errResponse(baseResponse.TOTAL_PRICE_ID_IS_EMPTY)); // 2027

  if (!regPrice.test(totalPrice))
    return res.send(errResponse(baseResponse.PRICE_IS_NOT_VALID)); // 2025

  // Request Error End

  // Response Error Start

  const checkUserExist = couponProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkStoreExist = await couponProvider.checkStoreExist(storeId);

  if (checkStoreExist === 0)
    return res.send(response(baseResponse.STORE_IS_NOT_EXIST)); // 3008

  const checkStoreDeleted = await couponProvider.checkStoreDeleted(storeId);

  if (checkStoreDeleted === 0)
    return res.send(response(baseResponse.STORE_IS_DELETED)); // 3010

  // Response Error End

  const result = await couponProvider.selectCartCoupons(
    userId,
    storeId,
    totalPrice
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
