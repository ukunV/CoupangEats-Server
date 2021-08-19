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
