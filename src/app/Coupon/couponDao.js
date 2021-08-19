// 유저 존재 여부 확인
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
                select exists(select id from Store where id = ?) as exist;
                `;

  const row = await connection.query(query, storeId);

  return row[0][0]["exist"];
}

// 음식점 삭제 여부 check
async function checkStoreDeleted(connection, storeId) {
  const query = `
                select isDeleted
                from Store
                where id = ?;
                `;

  const row = await connection.query(query, storeId);

  return row[0][0]["isDeleted"];
}

// My 이츠에서 쿠폰 목록 조회
async function selectMyEatsCoupons(connection, userId) {
  const query = `
            select c.couponName, concat(format(c.discount, 0), '원 할인') as discount,
                  concat(format(c.orderPrice, 0), '원 이상 주문 시') as orderPrice,
                  case
                      when c.endDate < now()
                          then '기간만료'
                      else
                          date_format(endDate, '%m/%d 까지')
                  end as endDate
            from Coupon c
                left join CouponObtained co on c.id = co.couponId
            where co.userId = ?
            order by co.createdAt desc;
            `;

  const row = await connection.query(query, userId);

  return row[0];
}

// 카트에서 쿠폰 목록 조회
async function selectCartCoupons(connection, userId, storeId, totalPrice) {
  const query = `
            select c.couponName, concat(format(c.discount, 0), '원 할인') as discount,
                  concat(format(c.orderPrice, 0), '원 이상 주문 시') as orderPrice,
                  case
                      when c.endDate < now()
                          then '기간만료'
                      else
                          date_format(endDate, '%m/%d 까지')
                  end as endDate,
                  case
                      when c.orderPrice <= ?
                          then 1
                      else
                          0
                  end as priceAvailable,
                  c.franchiseId as couponFranchiseId,
                  case
                      when c.franchiseId = 0
                          then 0
                      else
                          s.franchiseId
                  end as storeFranchiseId
            from Coupon c
                left join CouponObtained co on c.id = co.couponId
                left join Franchise f on c.franchiseId = f.id
                left join (select * from Store where id = ?) s on s.franchiseId = f.id
            where co.userId = ?
            group by co.createdAt
            order by co.createdAt desc;
            `;

  const row = await connection.query(query, [totalPrice, storeId, userId]);

  return row[0];
}

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
  selectMyEatsCoupons,
  selectCartCoupons,
};
