// 유저 존재 여부 확인
async function checkUserExist(connection, userId) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 결제방식(카드) 등록
async function createCard(
  connection,
  userId,
  number,
  validMonth,
  validYear,
  cvc,
  pwd
) {
  const query = `
                insert into Payment (userId, type, number, validMonth, validYear, cvc, pwd)
                values (?, 1, ?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, [
    userId,
    number,
    validMonth,
    validYear,
    cvc,
    pwd,
  ]);

  return row[0];
}

// 결제방식(계좌) 등록 - 입금주명(유저명) 조회
async function selectUserNameAtAccount(connection, userId) {
  const query = `
                select name
                from User
                where id = ?;
                `;

  const row = await connection.query(query, userId);

  return { userName: row[0][0]["name"] };
}

// 은행 존재 여부 check
async function checkBankExist(connection, bankId) {
  const query = `
                select exists(select id
                              from AccountBank
                              where id = ?) as exist;
                `;

  const row = await connection.query(query, bankId);

  return row[0][0]["exist"];
}

// 은행의 계좌번호 길이 check
async function checkAccountLength(connection, bankId, numLen) {
  const query = `
                select exists(select id
                              from AccountBank
                              where id = ?
                              and accountLen = ?) as exist;                
                `;

  const row = await connection.query(query, [bankId, numLen]);

  return row[0][0]["exist"];
}

// 결제방식(계좌) 등록
async function createAccount(connection, userId, bankId, number) {
  const query = `
                insert into Payment (userId, bankId, type, number)
                values (?, ?, 2, ?);
                `;

  const row = await connection.query(query, [userId, bankId, number]);

  return row[0];
}

// 결제방식 존재 여부 check
async function checkPaymentExist(connection, paymentId) {
  const query = `
                select exists(select id
                              from Payment
                              where id = ?
                              and isDeleted = 1) as exist;                
                `;

  const row = await connection.query(query, paymentId);

  return row[0][0]["exist"];
}

// 해당 유저의 결제방식이 맞는지 check
async function checkPaymentHost(connection, userId, paymentId) {
  const query = `
                select exists(select id
                              from Payment
                              where id = ?
                              and userId = ?) as exist;              
                `;

  const row = await connection.query(query, [paymentId, userId]);

  return row[0][0]["exist"];
}

// 결제방식 삭제
async function deletePayment(connection, paymentId) {
  const query = `
                update Payment
                set isDeleted = 0
                where id = ?;
                `;

  const row = await connection.query(query, paymentId);

  return row[0].info;
}

module.exports = {
  checkUserExist,
  createCard,
  selectUserNameAtAccount,
  checkBankExist,
  checkAccountLength,
  createAccount,
  checkPaymentExist,
  checkPaymentHost,
  deletePayment,
};
