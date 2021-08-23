const jwtMiddleware = require("../../../config/jwtMiddleware");
const orderProvider = require("../../app/Order/orderProvider");
const orderService = require("../../app/Order/orderService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const passport = require("passport");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

// regular expression
const regPrice = /^[0-9]/;

/**
 * API No. 56
 * API Name : 주문 정보 생성 API
 * [POST] /orders/order-detail
 */
exports.createOrder = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId, addressId, paymentId, deliveryFee, discount, finalPrice } =
    req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

  if (!addressId)
    return res.send(errResponse(baseResponse.ADDRESS_ID_IS_EMPTY)); // 2022

  if (!paymentId)
    return res.send(errResponse(baseResponse.PAYMENT_ID_IS_EMPTY)); // 2062

  if (!regPrice.test(deliveryFee))
    return res.send(errResponse(baseResponse.PAYMENT_ID_IS_EMPTY)); // 2072

  if (!regPrice.test(discount))
    return res.send(errResponse(baseResponse.PAYMENT_ID_IS_EMPTY)); // 2073

  if (!regPrice.test(finalPrice))
    return res.send(errResponse(baseResponse.FINAL_PRICE_IS_NOT_VALID)); // 2074

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkPaymentExist = await orderProvider.checkPaymentExist(
    userId,
    paymentId
  );

  if (checkPaymentExist === 0)
    return res.send(errResponse(baseResponse.PAYMENT_IS_NOT_EXIST)); // 3037

  // Response Error End

  const result = await orderService.createOrder(
    userId,
    storeId,
    addressId,
    paymentId,
    deliveryFee,
    discount,
    finalPrice
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 57
 * API Name : 주문 정보 생성 -> 쿠폰 상태 변경 API
 * [PATCH] /orders/order-detail/coupon
 * 사용한 쿠폰 없을 시 -> couponObtainedId: 0
 */
exports.changeCouponStatus = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { couponObtainedId } = req.body;

  if (couponObtainedId === 0) {
    return res.send(response(baseResponse.SUCCESS, "사용한 쿠폰이 없습니다."));
  }

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!couponObtainedId)
    return res.send(errResponse(baseResponse.COUPON_OBTAINED_ID_IS_EMPTY)); // 2075

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkCouponExist = await orderProvider.checkCouponExist(
    userId,
    couponObtainedId
  );

  if (checkCouponExist === 0)
    return res.send(errResponse(baseResponse.COUPON_IS_NOT_EXIST)); // 3015

  // Response Error End

  const result = await orderService.changeCouponStatus(couponObtainedId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 58
 * API Name : 주문 정보 생성 -> 카트 상태 변경 API
 * [PATCH] /orders/order-detail/cart
 * orderId, isDeleted 변경
 */
exports.changeCartStatus = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { rootIdArr } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await orderService.changeCartStatus(userId, rootIdArr);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 59
 * API Name : 주문내역 조회 API
 * [GET] /orders/order-list
 */
exports.getOrderList = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await orderProvider.selectOrderList(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 60
 * API Name : 영수증 조회 API
 * [GET] /orders/order-receipt
 * query string: orderId
 */
exports.getOrderReceipt = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { orderId } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkOrderExist = await orderProvider.checkOrderExist(userId, orderId);

  if (checkOrderExist === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_EXIST)); // 3027

  // Response Error End

  const result = await orderProvider.selectOrderReceipt(orderId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 61
 * API Name : 배달 현황 조회 API
 * [GET] /orders/delivery-status
 * query string: orderId
 */
exports.getDeliveryStatus = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { orderId } = req.query;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  // Request Error End

  // Response Error Start

  const checkUserExist = await orderProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await orderProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await orderProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkOrderExist = await orderProvider.checkOrderExist(userId, orderId);

  if (checkOrderExist === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_EXIST)); // 3027

  // Response Error End

  const result = await orderProvider.getDeliveryStatus(orderId);

  return res.send(response(baseResponse.SUCCESS, result));
};
