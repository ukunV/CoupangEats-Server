const jwtMiddleware = require("../../../config/jwtMiddleware");
const addressProvider = require("../../app/Address/addressProvider");
const addressService = require("../../app/Address/addressService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const kakaoMap = require("../../../controllers/kakao_ctrl").getAddressInfo;

/**
 * API No. 5
 * API Name : 주소 추가 API
 * [POST] /addresses
 */
exports.createAddresses = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { bodyId } = req.body;

  const { type, nickname, buildingName, address, detailAddress, information } =
    req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  const checkUserExist = addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2011

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2012

  if (!address) return res.send(errResponse(baseResponse.ADDRESS_IS_EMPTY)); // 2015

  // Request Error End

  const { lat, lng } = await kakaoMap(address);

  const result = await addressService.insertAddress(
    userId,
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 6
 * API Name : 주소 수정 API
 * [PATCH] /addresses/:addressId/detail
 */
exports.modifyAddresses = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { bodyId } = req.body;

  const { addressId } = req.params;

  const { type, nickname, buildingName, address, detailAddress, information } =
    req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  const checkUserExist = addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2011

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2012

  const checkAddressExist = await addressProvider.checkAddressExist(addressId);

  if (checkAddressExist === 0)
    return res.send(errResponse(baseResponse.ADDRESS_IS_NOT_EXIST)); // 2016

  if (!address) return res.send(errResponse(baseResponse.ADDRESS_IS_EMPTY)); // 2015

  // Request Error End

  const { lat, lng } = await kakaoMap(address);

  const result = await addressService.updateAddress(
    type,
    nickname,
    buildingName,
    address,
    detailAddress,
    information,
    lat,
    lng,
    addressId
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 7
 * API Name : 주소 삭제 API
 * [PATCH] /addresses/:addressId
 */
exports.deleteAddresses = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { bodyId } = req.body;

  const { addressId } = req.params;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  const checkUserExist = addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2011

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2012

  const checkAddressExist = await addressProvider.checkAddressExist(addressId);

  if (checkAddressExist === 0)
    return res.send(errResponse(baseResponse.ADDRESS_IS_NOT_EXIST)); // 2016

  // Request Error End

  const result = await addressService.deleteAddress(addressId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 8
 * API Name : 주소 목록 조회 API
 * [GET] /addresses
 */
exports.selectAddresses = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { bodyId } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  const checkUserExist = addressProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 2011

  if (userId !== bodyId)
    return res.send(errResponse(baseResponse.USER_ID_NOT_MATCH)); // 2012

  // Request Error End

  const result = await addressProvider.selectAddress(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};
