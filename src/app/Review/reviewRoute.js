module.exports = function (app) {
  const review = require("./reviewController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 32. 최근 포토 리뷰 3개 조회 API
  app.get("/reviews/:storeId/photo-review", review.getPhotoReviews);

  // 33. 리뷰 조회 API
  app.get("/reviews/:storeId/review-list", review.getReviewList);
};