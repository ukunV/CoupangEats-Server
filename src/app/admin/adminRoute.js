module.exports = function (app) {
  const admin = require("./adminController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 61. 라이더 위치 갱신 API
  app.post(
    "/orders/delivery/rider-location",
    jwtMiddleware,
    order.updateRiderLocation
  );
};
