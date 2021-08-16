module.exports = function (app) {
  const address = require("./addressController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 주소 추가 API
  app.post("/addresses", jwtMiddleware, address.createAddresses);

  // 주소 수정 API
  app.patch(
    "/addresses/:addressId/detail",
    jwtMiddleware,
    address.modifyAddresses
  );

  // 주소 삭제 API
  app.patch("/addresses/:addressId", jwtMiddleware, address.deleteAddresses);
};
