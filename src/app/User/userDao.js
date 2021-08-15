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

module.exports = {
  checkEmailExists,
  checkPhoneNumExists,
  createUser,
};
