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

// 홈 화면 조회
exports.selectHome = async function (userId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.selectHome(connection, userId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-selectHome Provider error: ${err.message}`);
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

// 이벤트 상태 check
exports.checkEventStatus = async function (eventId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkEventStatus(connection, eventId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkEventStatus Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};

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

// 공지 상태 check
exports.checkNoticeDeleted = async function (noticeId) {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    const result = await userDao.checkNoticeDeleted(connection, noticeId);
    connection.release();

    return result;
  } catch (err) {
    logger.error(`User-checkNoticeDeleted Provider error: ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
