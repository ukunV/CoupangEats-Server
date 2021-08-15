module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 테스트 API
  // app.get("/app/test", user.getTest);

  // 1. 회원가입 API
  app.post("/users/sign-up", user.createUsers);
};
