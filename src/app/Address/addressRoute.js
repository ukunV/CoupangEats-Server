module.exports = function (app) {
  const address = require("./addressController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 5. 주소 추가 API
  app.post("/addresses", jwtMiddleware, address.createAddresses);

  // 6. 주소 수정 API
  app.patch(
    "/addresses/:addressId/detail",
    jwtMiddleware,
    address.modifyAddresses
  );

  // 7. 주소 삭제 API
  app.patch(
    "/addresses/:addressId/status",
    jwtMiddleware,
    address.deleteAddresses
  );

  // 8. 주소 목록 조회 API
  app.get("/addresses", jwtMiddleware, address.selectAddresses);

  // 16. 집/회사 주소 존재 여부 확인 API
  app.get(
    "/addresses/:type/house-company",
    jwtMiddleware,
    address.checkHouseCompany
  );

  // 17. 주소 목록에서 주소 선택 API
  app.patch("/addresses/user-address", jwtMiddleware, address.changeLocation);
};
