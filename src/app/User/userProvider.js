const { pool } = require("../../../config/database");
const { errResponse } = require("../../../config/response");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

const user_ctrl = require("../../../controllers/user_ctrl");

// Provider: Read 비즈니스 로직 처리

// 이메일 존재 여부 확인
exports.checkEmailExist = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEmailExist(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEmailExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 전화번호 존재 여부 확인
exports.checkPhoneNumExist = async function (phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkPhoneNumExist(connection, phoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkPhoneNumExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 비밀번호 확인
exports.checkPassword = async function (email, password) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const salt = await userDao.getSalt(connection, email);

    const hashedPassword = await user_ctrl.makePasswordHashed(salt, password);

    const params = [email, hashedPassword];
    const result = await userDao.checkPassword(connection, params);

    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkPassword Provider error: ${err.message}`);
    return -1;
  }
};

// 유저 존재 여부 확인
exports.checkUserExist = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkUserExist(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkUserExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 홈 화면 조회 by userId
exports.selectHomeByUserId = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectHomeByUserId(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectHomeByUserId Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 홈 화면 조회 by address
exports.selectHomebyAddress = async function (address, lat, lng) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectHomebyAddress(
      connection,
      address,
      lat,
      lng
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectHomebyAddress Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 이벤트 목록 조회
exports.selectEventList = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectEventList(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectEventList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 이벤트 존재 여부 check
exports.checkEventExist = async function (eventId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEventExist(connection, eventId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEventExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 이벤트 상태 check
// exports.checkEventStatus = async function (eventId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await userDao.checkEventStatus(connection, eventId);
//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`User-checkEventStatus Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 이벤트 상세페이지 조회
exports.selectEvent = async function (eventId, distance) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectEvent(connection, eventId, distance);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectEvent Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 프랜차이즈 존재 여부 check
exports.checkFranchiseExist = async function (franchiseId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkFranchiseExist(connection, franchiseId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkFranchiseExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 이벤트 페이지 스토어로 이동
exports.eventToStore = async function (userId, franchiseId, distance) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.eventToStore(
      connection,
      userId,
      franchiseId,
      distance
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-eventToStore Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 공지사항 목록 조회
exports.selectNoticeList = async function () {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectNoticeList(connection);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectNoticeList Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 공지사항 세부페이지 조회
exports.selectNotice = async function (noticeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectNotice(connection, noticeId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectNotice Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 공지 존재 여부 check
exports.checkNoticeExist = async function (noticeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkNoticeExist(connection, noticeId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkNoticeExist Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// // 공지 상태 check
// exports.checkNoticeDeleted = async function (noticeId) {
//   try {
//     const connection = await pool.getConnection(async (conn) => conn);

//     const result = await userDao.checkNoticeDeleted(connection, noticeId);
//     connection.release();

//     return result;
//   } catch (err) {
//     logger.error(`User-checkNoticeDeleted Provider error: ${err.message}`);
//     return errResponse(baseResponse.DB_ERROR);
//   }
// };

// 계정 정지 여부 check
exports.checkUserBlocked = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkUserBlocked(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkUserBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 check
exports.checkUserWithdrawn = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkUserWithdrawn(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkUserWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check - 아이디 찾기
exports.checkMatchUserWithPhoneNum = async function (userName, phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkMatchUserWithPhoneNum(
      connection,
      userName,
      phoneNum
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(
      `User-checkMatchUserWithPhoneNum Provider error: ${err.message}`
    );
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 인증번호 일치여부 check - 아이디
exports.checkAuthNumByPhoneNum = async function (phoneNum, authNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkAuthNumByPhoneNum(
      connection,
      phoneNum,
      authNum
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkAuthNumByPhoneNum Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 아이디 찾기 - 인증번호 확인 및 이메일 제공
exports.selectEmail = async function (phoneNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectEmail(connection, phoneNum);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectEmail Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 정지 여부 check - 로그인
exports.checkEmailBlocked = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEmailBlocked(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEmailBlocked Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 계정 탈퇴 여부 check - 로그인
exports.checkEmailWithdrawn = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEmailWithdrawn(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEmailWithdrawn Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 전화번호 조회 - 비밀번호 찾기
exports.selectPhoneNum = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectPhoneNum(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectPhoneNum Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 존재 여부 check - 비밀번호 찾기
exports.checkMatchUserWithEmail = async function (userName, email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkMatchUserWithEmail(
      connection,
      userName,
      email
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkMatchUserWithEmail Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 인증번호 일치여부 check - 비밀번호
exports.checkAuthNumByEmail = async function (email, authNum) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkAuthNumByEmail(
      connection,
      email,
      authNum
    );
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkAuthNumByEmail Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

// 유저 고유 아이디 조회
exports.selectUserId = async function (email) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectUserId(connection, email);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectUserId Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
