const jwtMiddleware = require("../../../config/jwtMiddleware");
const paymentProvider = require("../../app/Payment/paymentProvider");
const paymentService = require("../../app/Payment/paymentService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const kakaoMap = require("../../../controllers/kakao_ctrl").getpaymentInfo;
