module.exports = function (app) {
  const order = require("./orderController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 56. 주문 정보 생성 API
  app.post("/orders/order-detail", jwtMiddleware, order.createOrder);

  // 57. 주문 정보 생성 -> 쿠폰 상태 변경 API
  app.patch(
    "/orders/order-detail/coupon",
    jwtMiddleware,
    order.changeCouponStatus
  );

  // 58. 주문 정보 생성 -> 카트 상태 변경 API
  app.patch("/orders/order-detail/cart", jwtMiddleware, order.changeCartStatus);

  // 59. 주문내역 조회 API
  app.get("/orders/order-list", jwtMiddleware, order.getOrderList);

  // 60. 영수증 조회 API
  app.get("/orders/order-receipt", jwtMiddleware, order.getOrderReceipt);

  // 61. 배달 현황 조회 API
  app.get("/orders/delivery-status", jwtMiddleware, order.getDeliveryStatus);
};
