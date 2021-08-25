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
  addressId,
  paymentId,
  deliveryFee,
  discount,
  finalPrice
) {
  const query = `
                insert into OrderList (userId, storeId, addressId, paymentId, deliveryFee, discount, finalPrice)
                values (?, ?, ?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, [
    userId,
    storeId,
    addressId,
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

// 주문 정보 생성 -> 쿠폰 상태 변경
async function changeCouponStatus(connection, couponObtainedId) {
  const query = `
                update CouponObtained
                set status = 0
                where id = ?;
                `;

  const row = await connection.query(query, couponObtainedId);

  return row[0].info;
}

// 주문 정보 생성 -> 카트 상태 변경
async function changeCartStatus(connection, userId, rootIdArr) {
  const getOrderIdQuery = `
                          select max(id) as orderId
                          from OrderList
                          where userId = ?;
                          `;

  const getOrderIdRow = await connection.query(getOrderIdQuery, userId);

  const orderId = getOrderIdRow[0][0]["orderId"];

  let affectedRows = 0;

  for (let i = 0; i < rootIdArr.length; i++) {
    const query = `
                  update Cart
                  set orderId = ?, isDeleted = 0
                  where userId = ?
                  and rootId = ?;
                  `;

    const row = await connection.query(query, [orderId, userId, rootIdArr[i]]);

    affectedRows += row[0].affectedRows;
  }

  return { affectedRows };
}

// 주문내역 조회
async function selectOrderList(connection, userId) {
  const query = `
                select ol.id as orderId, s.storeName, smi.imageURL,
                      case
                          when instr(date_format(ol.createdAt, '%Y-%m-%d %p %h:%i'), 'PM') > 0
                              then replace(date_format(ol.createdAt, '%Y-%m-%d %p %h:%i'), 'PM', '오후')
                          else
                              replace(DATE_FORMAT(ol.createdAt, '%Y-%m-%d %p %h:%i'), 'AM', '오전')
                      end as createdAt,
                      group_concat(case when c.rootId = c.menuId then concat(c.amount, '/', sm.menuName) else sm.menuName end order by c.rootId, c.menuId) as menuList,
                      case
                          when ol.status = 0
                              then '결제 취소'
                          when ol.status = 1
                              then '주문 대기'
                          when ol.status = 2
                              then '주문 수락'
                          when ol.status = 3
                              then '메뉴 준비중'
                          when ol.status = 4
                              then '배달 중'
                          when ol.status = 5
                              then '배달완료'
                      end as status, ol.reason, ol.finalPrice,
                      (10 -timestampdiff(day, ol.createdAt, now())) as reviewAvailable
                from OrderList ol
                    left join Store s on ol.storeId = s.id
                    left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                    left join Cart c on c.orderId = ol.id
                    left join StoreMenu sm on sm.id = c.menuId
                where ol.userId = ?
                group by ol.id
                order by ol.createdAt desc;
                `;

  const row = await connection.query(query, userId);

  return row[0];
}

// 주문내역 존재 여부 check
async function checkOrderExist(connection, userId, orderId) {
  const query = `
                select exists(select id
                              from OrderList
                              where userId = ?
                              and id = ?) as exist;
                `;

  const row = await connection.query(query, [userId, orderId]);

  return row[0][0]["exist"];
}

// 영수증 조회
async function selectOrderReceipt(connection, orderId) {
  const query = `
                select s.storeName, date_format(ol.createdAt, '%Y-%m-%d %H:%m') as createdAt,
                      group_concat(case when c.rootId = c.menuId then concat(c.amount, '/', sm.menuName, '/', sm.price) else concat(sm.menuName, '/', sm.price) end order by c.rootId, c.menuId) as menuList,
                      (ol.finalPrice - ol.deliveryFee - ol.discount) as orderPrice, ol.deliveryFee, ol.discount, ol.finalPrice,
                      case
                          when p.bankId is null
                              then '카드'
                          else
                              ab.bankName
                      end as type,
                      case
                          when p.bankId is null
                              then concat('****', left(right(p.number, 4), 3), '*')
                          else
                              concat('****', right(p.number, 4))
                      end as number,
                      case
                          when ol.isDeleted = 1
                              then '결제완료'
                          else
                              '환불예정'
                      end as status, ol.isDeleted
                from OrderList ol
                    left join Store s on ol.storeId = s.id
                    left join Payment p on ol.paymentId = p.id
                    left join AccountBank ab on p.bankId = ab.id
                    left join Cart c on c.orderId = ol.id
                    left join StoreMenu sm on sm.id = c.menuId
                where ol.id = ?;
                `;

  const row = await connection.query(query, orderId);

  return row[0];
}

// 배달 현황 조회
async function getDeliveryStatus(connection, orderId) {
  const query = `
                select ol.id as orderId, timestampdiff(minute, now(), date_add(ol.createdAt, interval 30 + 10 + s.deliveryTime minute)) as restTime,
                      date_format(date_add(ol.createdAt, interval 30 + 10 + s.deliveryTime minute), '%H:%i %p 도착예정') as arrival,
                      case
                          when ol.status = 0
                              then '결제 취소'
                          when ol.status = 1
                              then '주문 대기'
                          when ol.status = 2
                              then '주문 수락'
                          when ol.status = 3
                              then '메뉴 준비중'
                          when ol.status = 4
                              then '배달 중'
                          when ol.status = 5
                              then '배달완료'
                      end as status, date_format(ol.updatedAt, '%H:%i %p') as statusChange, concat(a.address, a.detailAddress) as address,
                      s.storeName, finalPrice,
                      case
                          when p.bankId is null
                              then '카드'
                          else
                              ab.bankName
                      end as type,
                      case
                          when p.bankId is null
                              then concat('****', left(right(p.number, 4), 3), '*')
                          else
                              concat('****', right(p.number, 4))
                      end as number,
                      group_concat(case when c.rootId = c.menuId then concat(c.amount, '/', sm.menuName) else sm.menuName end order by c.rootId, c.menuId) as menuList
                from OrderList ol
                    left join Store s on s.id = ol.storeId
                    left join Address a on ol.addressId = a.id
                    left join Cart c on c.orderId = ol.id
                    left join StoreMenu sm on sm.id = c.menuId
                    left join Payment p on ol.paymentId = p.id
                    left join AccountBank ab on ab.id = p.bankId
                where ol.id = ?;
                `;

  const row = await connection.query(query, orderId);

  return row[0];
}

module.exports = {
  checkUserExist,
  checkUserBlocked,
  checkUserWithdrawn,
  checkPaymentExist,
  createOrder,
  checkCouponExist,
  changeCouponStatus,
  changeCartStatus,
  selectOrderList,
  checkOrderExist,
  selectOrderReceipt,
  getDeliveryStatus,
};
