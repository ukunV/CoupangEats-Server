const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const { response, errResponse } = require("../../../config/response");
const secret_config = require("../../../config/secret");
const jwt = require("jsonwebtoken");

const regexEmail = require("regex-email");
const { emit } = require("nodemon");

const user_ctrl = require("../../../controllers/user_ctrl");

// regex
// const regexName = /^[가-힣]+$/;
const regPhoneNum = /^\d{10,11}$/;

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
// exports.getTest = async function (req, res) {
//   return res.send(response(baseResponse.SUCCESS));
// };

/**
 * API No. 1
 * API Name : 회원가입 API
 * [POST] /users/sign-up
 */
exports.createUsers = async function (req, res) {
  const { email, password, name, phoneNum } = req.body;

  // Request Error Start
  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002

  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_TYPE)); // 2003

  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004

  if (password.length < 8 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2005

  if (!name) return res.send(response(baseResponse.SIGNUP_NAME_EMPTY)); // 2006

  if (name.length > 10)
    return res.send(response(baseResponse.SIGNUP_NAME_LENGTH)); // 2007

  if (!phoneNum) return res.send(response(baseResponse.SIGNUP_PHONENUM_EMPTY)); // 2008

  if (!regPhoneNum.test(phoneNum))
    return res.send(response(baseResponse.SIGNUP_PHONENUM_TYPE)); // 2009
  // Request Error End

  // Response Error Start
  const checkEmailExists = await userProvider.checkEmailExists(email);

  if (checkEmailExists === 1)
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_EMAIL)); // 3001

  const checkPhoneNumExists = await userProvider.checkPhoneNumExists(phoneNum);

  if (checkPhoneNumExists === 1)
    return res.send(response(baseResponse.SIGNUP_REDUNDANT_PHONENUM)); // 3002
  // Response Error End

  // 비밀번호 암호화
  const { hashedPassword, salt } = await user_ctrl.createHashedPassword(
    password
  );

  const result = await userService.createUser(
    email,
    hashedPassword,
    salt,
    name,
    phoneNum
  );

  const token = await jwt.sign(
    {
      userId: result.insertId,
    }, // 토큰의 내용(payload)
    secret_config.jwtsecret, // 비밀키
    {
      expiresIn: "365d",
      subject: "userInfo",
    } // 유효 기간 365일
  );

  return res.send(
    response(baseResponse.SUCCESS, { userId: result.insertId, jwt: token })
  );
};

/**
 * API No. 2
 * API Name : 로그인 API
 * [POST] /users/sign-in
 */

exports.postUsers = async function (req, res) {
  const { email, password } = req.body;

  // Request Error Start
  if (!email) return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY)); // 2001

  if (email.length > 30)
    return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH)); // 2002

  if (!regexEmail.test(email))
    return res.send(response(baseResponse.SIGNUP_EMAIL_TYPE)); // 2003

  if (!password) return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY)); // 2004

  if (password.length < 8 || password.length > 20)
    return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH)); // 2005
  // Request Error End

  // Response Error Start
  const checkEmailExists = await userProvider.checkEmailExists(email);

  if (checkEmailExists === 0)
    return res.send(response(baseResponse.SIGNIN_EMAIL_NOT_EXISTS)); // 3003

  const checkPassword = await userProvider.checkPassword(email, password);

  if (checkPassword === -1)
    return res.send(response(baseResponse.SIGNIN_PASSWORD_WRONG)); // 3004
  // Response Error End

  const token = await jwt.sign(
    {
      userId: checkPassword,
    }, // 토큰의 내용(payload)
    secret_config.jwtsecret, // 비밀키
    {
      expiresIn: "365d",
      subject: "userInfo",
    } // 유효 기간 365일
  );

  return res.send(
    response(baseResponse.SUCCESS, { userId: checkPassword, jwt: token })
  );
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */

/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
