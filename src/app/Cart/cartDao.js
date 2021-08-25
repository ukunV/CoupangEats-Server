// 유저 존재 여부 check
async function checkUserExist(connection, userId) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 음식점 존재 여부 check
async function checkStoreExist(connection, storeId) {
  const query = `
                select exists(select id
                              from Store
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, storeId);

  return row[0][0]["exist"];
}

// // 음식점 삭제 여부 check
// async function checkStoreDeleted(connection, storeId) {
//   const query = `
//                 select isDeleted
//                 from Store
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, storeId);

//   return row[0][0]["isDeleted"];
// }

// 메뉴 존재 여부 check
async function checkMenuExist(connection, menuId) {
  const query = `
                select exists(select id
                              from StoreMenu
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, menuId);

  return row[0][0]["exist"];
}

// // 메뉴 삭제 여부 check
// async function checkMenuDeleted(connection, menuId) {
//   const query = `
//                 select isDeleted
//                 from StoreMenu
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, menuId);

//   return row[0][0]["isDeleted"];
// }

// 카트에 담기
async function createCart(
  connection,
  userId,
  storeId,
  menuId,
  amount,
  subIdArr
) {
  const existCheckQuery = `
                          select rootId, menuId, createdAt
                          from Cart
                          where rootId = ?
                          and isDeleted = 1
                          and userId = ?
                          order by createdAt, menuId;
                          `;

  const existCheckRow = await connection.query(existCheckQuery, [
    menuId,
    userId,
  ]);

  //////////////////////////////////////////////
  let existMainId;
  let existSubArr;
  let existCreatedAt;
  let same;
  let count = existCheckRow[0].length;
  let i = 0;
  //////////////////////////////////////////////
  while (true) {
    if (count === 0) break;

    existMainId = 0;
    existSubArr = [];

    existMainId = existCheckRow[0][i]["rootId"];
    existCreatedAt = existCheckRow[0][i]["createdAt"];
    count -= 1;
    i += 1;

    for (i; i < existCheckRow[0].length; i++) {
      if (existCheckRow[0][i]["rootId"] == existCheckRow[0][i]["menuId"]) {
        break;
      }
      existSubArr.push(existCheckRow[0][i]["menuId"]);
      count -= 1;
    }

    if ((existMainId == menuId) & (existSubArr.length === subIdArr.length)) {
      for (let i = 0; i < subIdArr.length; i++) {
        if (existSubArr[i] != subIdArr[i]) {
          same = 0;
          break;
        }
        same = 1;
      }
    }
    if (same === 1) break;
  }
  //////////////////////////////////////////////

  if (same === 1) {
    const query = `
                  update Cart
                  set amount = amount + ?
                  where userId = ?
                  and rootId = ?
                  and isDeleted = 1
                  and createdAt = ?;
                  `;

    await connection.query(query, [
      amount,
      userId,
      existMainId,
      existCreatedAt,
    ]);

    return `Same Menu -> add mount: ${amount}`;
  }

  const mainQuery = `
                insert into Cart (userId, storeId, rootId, menuId, amount)
                values (?, ?, ?, ?, ?);
                `;

  const mainRow = await connection.query(mainQuery, [
    userId,
    storeId,
    menuId,
    menuId,
    amount,
  ]);

  let insertCount = 0;

  for (let i = 0; i < subIdArr.length; i++) {
    const subQuery = `
                    insert into Cart (userId, storeId, rootId, menuId, amount)
                    values (?, ?, ?, ?, ?);
                    `;

    const subRow = await connection.query(subQuery, [
      userId,
      storeId,
      menuId,
      subIdArr[i],
      amount,
    ]);

    if (subRow[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  return { menuInsertResult: mainRow[0], subMenuInsertCount: insertCount };
}

// 카트 상태 check
async function checkCartExist(connection, userId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 같은 음식점의 메뉴 여부 check
async function checkSameStore(connection, userId, storeId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and storeId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, storeId]);

  return row[0][0]["exist"];
}

// // 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제
// async function deleteOtherStore(connection, userId) {
//   const query = `
//                 update Cart
//                 set isDeleted = 0
//                 where userId = ?;
//                 `;

//   const row = await connection.query(query, userId);

//   return row[0].info;
// }

// 카트에 다른 상점이 이미 있는지 check
async function checkOtherStoreExist(connection, userId, storeId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and storeId != ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, storeId]);

  return row[0][0]["exist"];
}

// 카트에 메뉴 존재 여부 check
async function checkMenuExistAtCart(connection, userId, rootId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and rootId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, rootId]);

  return row[0][0]["exist"];
}

// 메뉴 수량 변경
async function changeMenuAmount(connection, userId, rootId, amount) {
  const query = `
                update Cart
                set amount = ?
                where userId = ?
                and rootId = ?;
                `;

  const row = await connection.query(query, [amount, userId, rootId]);

  return row[0].info;
}

// 카트 비우기
async function cleanUpCart(connection, userId) {
  const query = `
                update Cart
                set isDeleted = 0
                where userId = ?;
                `;

  const row = await connection.query(query, userId);

  return row[0].info;
}

// 카트 조회
async function selectCart(connection, userId) {
  const query1 = `
                select id as addressId,
                      case
                          when type = 1
                              then '집'
                          when type = 2
                              then '회사'
                          when nickname != '' and nickname is not null
                              then nickname
                          when buildingName != '' and nickname is not null
                              then buildingName
                      else
                        address
                      end as name,
                      concat(address, ' ', detailAddress) as address
                from Address
                where isDeleted = 1
                and isChecked = 1
                and userId= ?;
                `;

  const row1 = await connection.query(query1, userId);

  const query2 = `
                  select c.rootId, c.menuId, c.storeId,
                        s.storeName, s.isCheetah, sm.menuName,
                        (sm.price * c.amount) as totalPrice, c.amount, c.createdAt
                  from Cart c
                      left join StoreMenu sm on c.menuId = sm.id
                      left join Store s on c.storeId = s.id
                  where c.isDeleted = 1
                  and c.userId = ?;
                `;

  const row2 = await connection.query(query2, userId);

  const query3 = `
                  select p.id as paymentId,
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
                        end as number
                  from Payment p
                      left join AccountBank ab on p.bankId = ab.id
                  where p.userId = ?
                  and p.isChecked = 1;
                  `;

  const row3 = await connection.query(query3, userId);

  return { userInfo: row1[0], cartInfo: row2[0], paymentInfo: row3[0] };
}

// 카트 배달비 조회
async function selectCartDeliveryFee(connection, storeId, totalPrice) {
  const query = `
                select price as deliveryFee
                from StoreDeliveryPrice
                where storeId = ?
                and orderPrice <= ?
                order by orderPrice desc
                limit 1;
                `;
  // ifnull -> 최소주문금액(배달비의 주문금액 중 제일 작은 금액)
  //            보다 작은 경우 가장 비싼 배달비 반환

  const row = await connection.query(query, [storeId, totalPrice]);

  if (row[0].length === 0) return null;

  return row[0];
}

// 카트 최대 할인 쿠폰 조회
async function selectCartCoupon(connection, userId, storeId, totalPrice) {
  const query1 = `
                  select co.id as couponObtainedId, c.discount
                  from Coupon c
                      left join CouponObtained co on c.id = co.couponId
                      left join Franchise f on c.franchiseId = f.id
                      left join Store s on f.id = s.franchiseId
                  where co.userId = ?
                  and (s.id = ? or s.id is null)
                  and orderPrice <= ?
                  and co.status = 1
                  and c.status = 1
                  order by discount desc
                  limit 1;
                  `;

  const row1 = await connection.query(query1, [userId, storeId, totalPrice]);

  if (row1[0].length === 0) {
    return { couponObtainedId: 0, discount: 0 };
  }

  const query2 = `
                  update CouponObtained
                  set isChecked = 0
                  where userId = ?
                  `;

  await connection.query(query2, userId);

  const query3 = `
                  update CouponObtained
                  set isChecked = 1
                  where id = ?;
                  `;

  await connection.query(query3, row1[0][0]["couponObtainedId"]);

  return row1[0];
}

// 쿠폰 획득 여부 check
async function checkCouponObtainedExist(connection, userId, couponObtainedId) {
  const query = `
                select exists(select id
                              from CouponObtained
                              where userId = ?
                              and id = ?) as exist;
                `;

  const row = await connection.query(query, [userId, couponObtainedId]);

  return row[0][0]["exist"];
}

// 카트에서 쿠폰 선택
async function changeCoupon(connection, couponObtainedId) {
  const query = `
                  update CouponObtained
                  set isChecked = 1
                  where id = ?;
                  `;

  const row = await connection.query(query, couponObtainedId);

  return row[0].info;
}

// 카트에서 쿠폰 변경
async function selectCouponChoice(connection, userId) {
  const query = `
                select co.id as couponObtainedId, c.discount
                from CouponObtained co
                    left join Coupon c on co.couponId = c.id
                where userId = ?
                and isChecked = 1;
                `;

  const row = await connection.query(query, userId);

  return row[0];
}

// 카트에서 쿠폰 선택 제거
async function deleteCouponChoice(connection, userId) {
  const query = `
                  update CouponObtained
                  set isChecked = 0
                  where userId = ?;
                  `;

  const row = await connection.query(query, userId);

  return row[0].info;
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

// 카트에서 결제수단 변경
async function changePayment(connection, userId, paymentId) {
  const query1 = `
                update Payment
                set isChecked = 0
                where userId = ?;
                `;

  await connection.query(query1, userId);

  const query2 = `
                  update Payment
                  set isChecked = 1
                  where id = ?;
                  `;

  const row2 = await connection.query(query2, paymentId);

  return row2[0].info;
}
// 카트에서 특정 메뉴 삭제
async function deleteCartMenu(connection, userId, menuId, createdAt) {
  const query = `
                update Cart
                set isDeleted = 0
                where userId = ?
                and rootId = ?
                and createdAt = ?;
                `;

  const row = await connection.query(query, [userId, menuId, createdAt]);

  return row[0].info;
}

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkMenuExist,
  createCart,
  checkCartExist,
  checkSameStore,
  checkOtherStoreExist,
  checkMenuExistAtCart,
  changeMenuAmount,
  cleanUpCart,
  selectCart,
  selectCartDeliveryFee,
  selectCartCoupon,
  checkCouponObtainedExist,
  changeCoupon,
  selectCouponChoice,
  deleteCouponChoice,
  checkUserBlocked,
  checkUserWithdrawn,
  checkPaymentExist,
  changePayment,
  deleteCartMenu,
};
