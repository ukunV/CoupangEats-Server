module.exports = function (app) {
  const order = require("./orderController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 55. 주문 정보 생성 API
  app.post("/orders/order-detail", jwtMiddleware, order.createOrder);

  // 56. 주문 정보 생성 -> 사용한 쿠폰 사용 처리 API
  app.patch(
    "/orders/order-detail/coupon",
    jwtMiddleware,
    order.changeCouponStatus
  );
};
