module.exports = function (app) {
  const review = require("./reviewController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 32. 최근 포토 리뷰 3개 조회 API
  app.get("/reviews/:storeId/photo-review", review.getPhotoReviews);

  // 33. 리뷰 조회 API
  app.get("/reviews/:storeId/review-list", review.getReviewList);

  // 34. 리뷰 작성 API
  app.post("/reviews/detail", jwtMiddleware, review.createReview);

  // 35. 리뷰 삭제 API
  app.patch("/reviews", jwtMiddleware, review.deleteReview);

  // 36. 리뷰 신고 API
  app.post(
    "/reviews/:reviewId/review-report",
    jwtMiddleware,
    review.reportReview
  );

  // 37. 내가 작성한 리뷰 조회 API
  app.get("/reviews/:orderId/review-detail", jwtMiddleware, review.getMyReview);

  // 38. 리뷰 수정 API
  app.patch("/reviews/detail", jwtMiddleware, review.modifyReview);
};
