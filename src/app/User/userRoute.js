module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");

  // 0. 테스트 API
  // app.get("/app/test", user.getTest);

  // 1. 회원가입 API
  app.post("/users/sign-up", user.createUsers);

  // 2. 로그인 API
<<<<<<< Updated upstream
  app.post("/users/sign-in", user.postUsers);
=======
<<<<<<< Updated upstream
  app.get("/users/sign-in", user.getUsers);
=======
  app.post("/users/sign-in", user.userLogIn);

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
>>>>>>> Stashed changes
>>>>>>> Stashed changes
};
