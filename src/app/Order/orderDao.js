// 유저 존재 여부 check
async function checkUserExist(connection, userId) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 계정 정지 여부 확인
async function checkUserBlocked(connection, userId) {
  const query = `
                select exists(select id
                              from User
                              where id = ?
                              and status = 2) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 계정 탈퇴 여부 확인
async function checkUserWithdrawn(connection, userId) {
  const query = `
                select exists(select id
                              from User
                              where id = ?
                              and status = 0) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 결제수단 존재 여부 check
async function checkPaymentExist(connection, userId, paymentId) {
  const query = `
                select exists(select id
                              from Payment
                              where userId = ?
                              and id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, paymentId]);

  return row[0][0]["exist"];
}

// 주문 정보 생성
async function createOrder(
  connection,
  userId,
  storeId,
  paymentId,
  deliveryFee,
  discount,
  finalPrice
) {
  const query = `
                insert into OrderList (userId, storeId, paymentId, deliveryFee, discount, finalPrice)
                values (?, ?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, [
    userId,
    storeId,
    paymentId,
    deliveryFee,
    discount,
    finalPrice,
  ]);

  return row[0];
}
module.exports = {
  checkUserExist,
  checkUserBlocked,
  checkUserWithdrawn,
  checkPaymentExist,
  createOrder,
};
