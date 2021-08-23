module.exports = function (app) {
  const admin = require("./adminController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 101. 주문 상태 변경 API
  app.patch("/admin/order-status", admin.updateOrderStatus);

  // 102. 라이더 위치 초기 세팅 API
  app.post("/admin/delivery/rider-arrange", admin.createRider);

  // 103. 라이더 위치 갱신 API
  app.patch("/admin/delivery/rider-location", admin.updateRider);
};
