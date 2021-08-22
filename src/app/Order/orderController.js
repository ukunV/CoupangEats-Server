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
 * API No. 55
 * API Name : 주문 정보 생성 API
 * [POST] /orders/order-detail
 */
exports.createOrder = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { storeId, paymentId, deliveryFee, discount, finalPrice } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!storeId) return res.send(errResponse(baseResponse.STORE_ID_IS_EMPTY)); // 2026

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
    paymentId,
    deliveryFee,
    discount,
    finalPrice
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
