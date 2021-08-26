module.exports = function (app) {
  const cart = require("./cartController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 19. 카트에 담기 API
  app.post("/carts/:storeId/menu", jwtMiddleware, cart.createCarts);

  // // 20. 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제 API
  // app.patch("/carts/:storeId/menu", jwtMiddleware, cart.deleteOtherStore);

  // 46. 메뉴 수량 변경 API
  app.patch("/carts/amount", jwtMiddleware, cart.changeMenuAmount);

  // 47. 카트 비우기 API
  app.patch("/carts/clean-up", jwtMiddleware, cart.cleanUpCart);

  // 48. 카트 조회 API
  app.get("/carts/detail", jwtMiddleware, cart.getCart);

  // 49. 카트 배달비 조회 API
  app.get("/carts/detail/delivery-fee", jwtMiddleware, cart.getCartDeliveryFee);

  // 50. 카트 최대 할인 쿠폰 조회 API
  app.get("/carts/detail/coupon", jwtMiddleware, cart.getCartCoupon);

  // 51. 카트에서 쿠폰 선택 API
  app.patch("/carts/detail/coupon-choice", jwtMiddleware, cart.changeCoupon);

  // 52. 카트에서 선택한 쿠폰 조회 API
  app.get("/carts/detail/coupon-choice", jwtMiddleware, cart.getCouponChoice);

  // 53. 카트에서 쿠폰 선택 제거 API
  app.patch("/carts/detail/coupon", jwtMiddleware, cart.deleteCouponChoice);

  // 55. 카트에서 결제수단 변경 API
  app.patch("/carts/detail/payment-choice", jwtMiddleware, cart.changePayment);

  // 67. 카트에서 특정 메뉴 삭제 API
  app.patch("/carts/menu", jwtMiddleware, cart.deleteCartMenu);
};
