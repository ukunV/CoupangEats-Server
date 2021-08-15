const dist_ctrl = require("../../../controllers/dist_ctrl");

// 이메일 존재 여부 확인
async function checkEmailExists(connection, email) {
  const query = `
    select exists(select email from User where email = ?) as exist;
    `;

  const row = await connection.query(query, email);

  return row[0][0]["exist"];
}

// 전화번호 존재 여부 확인
async function checkPhoneNumExists(connection, phoneNum) {
  const query = `
    select exists(select phoneNum from User where phoneNum = ?) as exist;
    `;

  const row = await connection.query(query, phoneNum);

  return row[0][0]["exist"];
}

// 회원가입
async function createUser(connection, params) {
  const query = `
                insert into User(email, password, salt, name, phoneNum)
                values (?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, params);

  return row[0];
}

// salt값 가져오기
async function getSalt(connection, email) {
  const query = `
                select salt
                from User
                where email = ?;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["salt"];
}

// 비밀번호 확인
async function checkPassword(connection, params) {
  const query = `
                select ifnull(id, 0) as id
                from User
                where email = ? and password = ?;
                `;

  const row = await connection.query(query, params);

  return row[0][0]["id"];
}

// 유저 존재 여부 확인
async function checkUserExists(connection, userId) {
  const query = `
    select exists(select id from User where id = ?) as exist;
    `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 유저 주소 변경
async function updateAddress(connection, params) {
  const query = `
                update User
                set userLatitude = ?, userLongtitude = ?
                where id = ?;
                `;

  const row = await connection.query(query, params);

  return row[0].info;
}

module.exports = {
  checkEmailExists,
  checkPhoneNumExists,
  createUser,
  getSalt,
  checkPassword,
  checkUserExists,
  updateAddress,
};
