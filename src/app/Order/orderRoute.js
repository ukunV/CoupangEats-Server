module.exports = function (app) {
  const order = require("./orderController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 55. 주문 정보 생성 API
  app.post("/orders/order-detail", jwtMiddleware, order.createOrder);
};
