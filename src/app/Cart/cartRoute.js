module.exports = function (app) {
  const cart = require("./cartController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 18. 카트에 담기 API
  app.post("/carts/:storeId/menu", jwtMiddleware, cart.createCarts);
};
