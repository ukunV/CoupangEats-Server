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

// 쿠폰 존재 여부 check
async function checkCouponExist(connection, userId, couponObtainedId) {
  const query = `
                select exists(select id
                              from CouponObtained
                              where userId = ?
                              and id = ?
                              and status = 1) as exist;
                `;

  const row = await connection.query(query, [userId, couponObtainedId]);

  return row[0][0]["exist"];
}

// 주문 정보 생성 -> 사용한 쿠폰 사용 처리
async function changeCouponStatus(connection, couponObtainedId) {
  const query = `
                update CouponObtained
                set status = 0
                where id = ?;
                `;

  const row = await connection.query(query, couponObtainedId);

  return row[0].info;
}

module.exports = {
  checkUserExist,
  checkUserBlocked,
  checkUserWithdrawn,
  checkPaymentExist,
  createOrder,
  checkCouponExist,
  changeCouponStatus,
};
