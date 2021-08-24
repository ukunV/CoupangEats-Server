module.exports = function (app) {
  const user = require("./userController");
  const jwtMiddleware = require("../../../config/jwtMiddleware");
  const passport = require("passport");

  // 0. 테스트 API
  // app.get("/app/test", user.getTest);

  // 1. 회원가입 API
  app.post("/users/sign-up", user.createUsers);

  // 2. 로그인 API
  app.post("/users/sign-in", user.userLogIn);

  // 3. 로그아웃 API
  app.post("/users/sign-out", jwtMiddleware, user.userLogOut);

  // // 4. 유저 주소 변경 API
  // app.patch("/users/address", jwtMiddleware, user.changeAddress);

  // 9. 홈 화면 조회 API
  app.get("/users/home", jwtMiddleware, user.getHome);

  // 27. 이벤트 목록 조회 API
  app.get("/users/my-eats/event-list", jwtMiddleware, user.getEventList);

  // 28. 이벤트 상세페이지 조회 API
  app.get("/users/my-eats/:eventId/event-list", jwtMiddleware, user.getEvent);

  // 29. 이벤트 페이지 스토어로 이동 API
  app.get(
    "/users/my-eats/event/franchise-store",
    jwtMiddleware,
    user.eventToStore
  );

  // 30. 공지사항 목록 조회 API
  app.get("/users/my-eats/notice-list", jwtMiddleware, user.getNoticeList);

  // 31. 공지사항 세부페이지 조회 API
  app.get(
    "/users/my-eats/:noticeId/notice-detail",
    jwtMiddleware,
    user.getNotice
  );

  // 62. 아이디 찾기 - 인증번호 전송 및 저장 API
  app.patch("/users/user-account/auth", user.findEmail);

  // 63. 아이디 찾기 - 인증번호 확인 및 이메일 제공 API
  app.get("/users/user-account", user.getEmail);

  // 64. 비밀번호 찾기 - 인증번호 전송 및 저장 API
  app.patch("/users/user-password/auth", user.findPassword);

  // 64. 비밀번호 찾기 - 인증번호 전송 및 저장 API
  app.patch("/users/user-password/reset", user.updatePassword);

  // 65. 카카오 로그인 API
  // client start
  app.get("/kakao", passport.authenticate("kakao-login"));
  app.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao-login", {
      successRedirect: "/",
      failureRedirect: "/",
    }),
    (req, res) => {
      res.redirect("/");
    }
  );
  // client end
  app.post("/users/kakao-login", user.kakaoLogin);
};
