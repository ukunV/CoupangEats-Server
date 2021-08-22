module.exports = function (app) {
  const order = require("./orderController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 55. 주문 정보 생성 API
  app.post("/orders/order-detail", jwtMiddleware, order.createOrder);

  // 56. 주문 정보 생성 -> 쿠폰 상태 변경 API
  app.patch(
    "/orders/order-detail/coupon",
    jwtMiddleware,
    order.changeCouponStatus
  );

  // 57. 주문 정보 생성 -> 카트 상태 변경 API
  app.patch("/orders/order-detail/cart", jwtMiddleware, order.changeCartStatus);
};
