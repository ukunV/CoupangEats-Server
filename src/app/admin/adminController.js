const jwtMiddleware = require("../../../config/jwtMiddleware");
const adminProvider = require("../../app/admin/adminProvider");
const adminService = require("../../app/admin/adminService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const passport = require("passport");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const kakaoMap = require("../../../controllers/kakao_ctrl").getAddressInfo;

/**
 * API No. 61
 * API Name : 라이더 위치 갱신 API
 * [POST] /orders/delivery/rider-location
 */
exports.updateRiderLocation = async function (req, res) {
  const { orderId, address } = req.body;

  const location = await kakaoMap(address);

  // Request Error Start

  if (location.length)
    return res.send(errResponse(baseResponse.LOCATION_INFO_IS_NOT_VALID)); // 2076

  // Request Error End

  // Response Error Start

  const checkOrderAlive = await orderProvider.checkOrderAlive(orderId);

  if (checkOrderAlive === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_FINISHED)); // 3042

  // Response Error End

  const result = await storeService.updateRiderLocation(
    orderId,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 62
 * API Name : 주문 상태 변경(주문 수락됨) API
 * [PATCH] /orders/:orderId/order-accept
 */
exports.updateRiderLocation = async function (req, res) {
  const { orderId } = req.params;

  // Request Error Start

  if (!orderId) return res.send(errResponse(baseResponse.ORDER_ID_IS_EMPTY)); // 2040

  // Request Error End

  // Response Error Start

  const checkOrderStatus = await orderProvider.checkOrderStatus(orderId, 1);

  if (checkOrderStatus === 0)
    return res.send(errResponse(baseResponse.ORDER_IS_NOT_WAITING_STATUS)); // 3043

  // Response Error End

  const result = await storeService.updateRiderLocation(
    orderId,
    location.lat,
    location.lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};
