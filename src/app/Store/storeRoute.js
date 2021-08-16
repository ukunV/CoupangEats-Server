module.exports = function (app) {
  const store = require("./storeController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 1. 음식 카테고리 조회 API
  app.get("/stores/food-category", store.getFoodCategory);
};
