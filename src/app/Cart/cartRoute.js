module.exports = function (app) {
  const cart = require("./cartController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 19. 카트에 담기 API
  app.post("/carts/:storeId/menu", jwtMiddleware, cart.createCarts);

  // 20. 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제 API
  app.patch("/carts/:storeId/menu", jwtMiddleware, cart.deleteOtherStore);
};
