module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 테스트 API
  // app.get("/app/test", user.getTest);

  // 1. 회원가입 API
  app.post("/users/sign-up", user.createUsers);

  // 2. 로그인 API
  app.post("/users/sign-in", user.userLogIn);

  // 3. 로그아웃 API

  // 4. 유저 주소 변경 API
  app.patch("/users/address", jwtMiddleware, user.changeAddress);

  // // API No 6. 카카오 로그인 API
  // app.post("/users/kakao-login", user.kakaoLogin);
  // app.get("/kakao", passport.authenticate("kakao-login"));
  // app.get(
  //   "/auth/kakao/callback",
  //   passport.authenticate("kakao-login", {
  //     successRedirect: "/",
  //     failureRedirect: "/",
  //   }),
  //   (req, res) => {
  //     res.redirect("/");
  //   }
  // );
};
