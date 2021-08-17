module.exports = function (app) {
  const store = require("./storeController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 10. 음식 카테고리 조회 API
  app.get("/stores/food-category", store.getFoodCategory);

  // 11. 새로 들어왔어요 목록 조회 API
  app.get("/stores/:categoryId/new-store", jwtMiddleware, store.getNewStore);

  // 12. 음식점 조회 by categoryId API
  app.get(
    "/stores/:categoryId/list",
    jwtMiddleware,
    store.getStoresByCategoryId
  );
};
