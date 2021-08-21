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
};
