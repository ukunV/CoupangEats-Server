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

  // 13. 음식점 상세페이지 조회 API
  app.get("/stores/:storeId/store-detail", store.getStore);

  // 14. 음식점 배달비 자세히 API
  app.get("/stores/:storeId/delivery-detail", store.getStoreDelivery);

  // 15. 음식점 매장/원산지 정보 조회 API
  app.get("/stores/:storeId/info-detail", store.getStoreInfo);

  // 18. 메인 메뉴 조회 API
  app.get("/stores/:menuId/menu-detail", store.getMainMenu);

  // 24. 음식점 즐겨찾기 추가 API
  app.post("/stores/:storeId/store-like", jwtMiddleware, store.createStoreLike);

  // 25. 음식점 즐겨찾기 삭제 API
  app.patch(
    "/stores/:storeId/store-like",
    jwtMiddleware,
    store.deleteStoreLike
  );

  // 26. 즐겨찾기 목록 조회 API
  app.get("/stores/store-like", jwtMiddleware, store.getStoreLike);
};
