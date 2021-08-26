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

// 계좌/카드/현금 영수증 조회
// 현금영수증 변경

/**
 * API No. 39
 * API Name : 결제방식(카드) 등록 API
 * [POST] /payments/:type/credit-card
 */
exports.createCard = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { type } = req.params;

  const { number, validMonth, validYear, cvc, pwd } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!type) return res.send(errResponse(baseResponse.PAYMENT_TYPE_IS_EMPTY)); // 2046

  if (type != 1)
    return res.send(errResponse(baseResponse.TYPE_IS_NOT_FOR_CARD)); // 2058

  if (!number) return res.send(errResponse(baseResponse.CARD_NUM_IS_EMPTY)); // 2051

  if (!validMonth)
    return res.send(errResponse(baseResponse.VALID_MONTH_IS_EMPTY)); // 2052

  if (!validYear)
    return res.send(errResponse(baseResponse.VALID_YEAR_IS_EMPTY)); // 2053

  if (!cvc) return res.send(errResponse(baseResponse.CVC_NUM_IS_EMPTY)); // 2054

  if (!pwd) return res.send(errResponse(baseResponse.CARD_PWD_IS_EMPTY)); // 2055

  if (number.length != 19)
    return res.send(errResponse(baseResponse.CARD_NUM_IS_NOT_VALID)); // 2047

  if (
    (validMonth.length != 2) |
    ((validMonth !== "01") &
      (validMonth !== "02") &
      (validMonth !== "03") &
      (validMonth !== "04") &
      (validMonth !== "05") &
      (validMonth !== "06") &
      (validMonth !== "07") &
      (validMonth !== "08") &
      (validMonth !== "09") &
      (validMonth !== "10") &
      (validMonth !== "11") &
      (validMonth !== "12"))
  )
    return res.send(errResponse(baseResponse.VALID_MONTH_IS_NOT_VALID)); // 2048

  if (validYear.length != 2)
    return res.send(errResponse(baseResponse.VALID_YEAR_IS_NOT_VALID)); // 2049

  const today = new Date();

  const year = today.getFullYear();
  let month = today.getMonth() + 1;

  if (month in [1, 2, 3, 4, 5, 6, 7, 8, 9]) month = `0${month}`;
  const now = `${year}` + `${month}`;

  if (now > `20${validYear}${validMonth}`)
    return res.send(errResponse(baseResponse.CARD_IS_EXPIRED)); // 2050

  if (cvc.length != 3)
    return res.send(errResponse(baseResponse.CVC_NUM_LENGTH_ERROR)); // 2056

  if (pwd.length != 2)
    return res.send(errResponse(baseResponse.CARD_PWD_LENGTH_ERROR)); // 2057

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentService.createCard(
    userId,
    number,
    validMonth,
    validYear,
    cvc,
    pwd
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 40
 * API Name : 결제방식(계좌) 등록 - 입금주명(유저명) 조회 API
 * [GET] /payments/account/user-name
 */
exports.getUserNameAtAccount = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentProvider.selectUserNameAtAccount(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 41
 * API Name : 결제방식(계좌) 등록 API
 * [POST] /payments/:type/account
 * query string: bankId
 */
exports.createAccount = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { type } = req.params;

  const { bankId } = req.query;

  const { number } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!type) return res.send(errResponse(baseResponse.PAYMENT_TYPE_IS_EMPTY)); // 2046

  if (type != 2)
    return res.send(errResponse(baseResponse.TYPE_IS_NOT_FOR_ACCOUNT)); // 2059

  if (!bankId) return res.send(errResponse(baseResponse.BANK_ID_IS_EMPTY)); // 2060

  if (!number) return res.send(errResponse(baseResponse.ACCOUNT_NUM_IS_EMPTY)); // 2061

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkBankExist = await paymentProvider.checkBankExist(bankId);

  if (checkBankExist === 0)
    return res.send(errResponse(baseResponse.BANK_IS_NOT_EXIST)); // 3035

  const numLen = number.length;

  const checkAccountLength = await paymentProvider.checkAccountLength(
    bankId,
    numLen
  );

  if (checkAccountLength === 0)
    return res.send(errResponse(baseResponse.NUMBER_LENGTH_IS_NOT_VALID)); // 3036

  // Response Error End

  const result = await paymentService.createAccount(userId, bankId, number);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 42
 * API Name : 결제방식 삭제 API
 * [PATCH] /payments
 */
exports.deletePayment = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { paymentId } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!paymentId)
    return res.send(errResponse(baseResponse.PAYMENT_ID_IS_EMPTY)); // 2062

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  const checkPaymentExist = await paymentProvider.checkPaymentExist(paymentId);

  if (checkPaymentExist === 0)
    return res.send(errResponse(baseResponse.PAYMENT_IS_NOT_EXIST)); // 3037

  const checkPaymentHost = await paymentProvider.checkPaymentHost(
    userId,
    paymentId
  );

  if (checkPaymentHost === 0)
    return res.send(errResponse(baseResponse.PAYMENT_IS_NOT_USERS)); // 3038

  // Response Error End

  const result = await paymentService.deletePayment(paymentId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 43
 * API Name : 현금영수증 발급 정보 조회 API
 * [GET] /payments/cash-receipt
 */
exports.getCashReceiptInfo = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentProvider.selectCashReceiptInfo(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 44
 * API Name : 현금영수증 발급 정보 변경 API
 * [PATCH] /payments/cash-receipt
 */
exports.modifyCashReceiptMethod = async function (req, res) {
  const { userId } = req.verifiedToken;

  const { isGet, cashReceiptMethod, cashReceiptNum } = req.body;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  if (!isGet) return res.send(errResponse(baseResponse.IS_GET_IS_EMPTY)); // 2063

  if (!(isGet in [0, 1]))
    return res.send(errResponse(baseResponse.IS_GET_IS_NOT_VALID)); // 2064

  if (!cashReceiptMethod)
    return res.send(errResponse(baseResponse.CASH_RECEIPT_METHOD_IS_EMPTY)); // 2065

  if (!(cashReceiptMethod in [1, 2, 3, 4]))
    return res.send(errResponse(baseResponse.CASH_RECEIPT_METHOD_IS_NOT_VALID)); // 2066

  if (!cashReceiptNum)
    return res.send(errResponse(baseResponse.CASH_RECEIPT_NUM_IS_EMPTY)); // 2067

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentService.modifyCashReceiptMethod(
    userId,
    isGet,
    cashReceiptMethod,
    cashReceiptNum
  );

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 45
 * API Name : 결제 관리 페이지 조회 API
 * [GET] /payments/detail
 */
exports.getPayment = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentProvider.selectPayment(userId);

  return res.send(response(baseResponse.SUCCESS, result));
};

/**
 * API No. 54
 * API Name : 계좌 은행 목록 조회 API
 * [GET] /payments/account/bank-list
 */
exports.getBankList = async function (req, res) {
  const { userId } = req.verifiedToken;

  // Request Error Start

  if (!userId) return res.send(errResponse(baseResponse.USER_ID_IS_EMPTY)); // 2010

  // Request Error End

  // Response Error Start

  const checkUserExist = await paymentProvider.checkUserExist(userId);

  if (checkUserExist === 0)
    return res.send(errResponse(baseResponse.USER_IS_NOT_EXIST)); // 3006

  const checkUserBlocked = await paymentProvider.checkUserBlocked(userId);

  if (checkUserBlocked === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_BLOCKED)); // 3998

  const checkUserWithdrawn = await paymentProvider.checkUserWithdrawn(userId);

  if (checkUserWithdrawn === 1)
    return res.send(errResponse(baseResponse.ACCOUNT_IS_WITHDRAWN)); // 3999

  // Response Error End

  const result = await paymentProvider.selectBankList();

  return res.send(response(baseResponse.SUCCESS, result));
};
