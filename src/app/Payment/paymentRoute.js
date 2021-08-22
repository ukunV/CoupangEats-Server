module.exports = function (app) {
  const payment = require("./paymentController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 39. 결제방식(카드) 등록 API
  app.post("/payments/:type/credit-card", jwtMiddleware, payment.createCard);

  // 40. 결제방식(계좌) 등록 - 입금주명(유저명) 조회 API
  app.get(
    "/payments/account/user-name",
    jwtMiddleware,
    payment.getUserNameAtAccount
  );

  // 41. 결제방식(계좌) 등록 API
  app.post("/payments/:type/account", jwtMiddleware, payment.createAccount);

  // 42. 결제방식 삭제 API
  app.patch("/payments", jwtMiddleware, payment.deletePayment);

  // 43. 현금영수증 발급 정보 조회 API
  app.get("/payments/cash-receipt", jwtMiddleware, payment.getCashReceiptInfo);

  // 44. 현금영수증 발급 정보 조회 API
  app.patch(
    "/payments/cash-receipt",
    jwtMiddleware,
    payment.modifyCashReceiptMethod
  );

  // 45. 결제 관리 페이지 조회
  app.get("/payments/detail", jwtMiddleware, payment.getPayment);

  // 54. 계좌 은행 목록 조회 API
  app.get("/payments/account/bank-list", jwtMiddleware, payment.getBankList);
};
