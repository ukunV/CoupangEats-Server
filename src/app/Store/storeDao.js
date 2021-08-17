// 음식 카테고리 조회
async function selectFoodCategory(connection) {
  const query = `
                select id, categoryName, imageURL
                from StoreCategory;
                `;

  const row = await connection.query(query);

  return row[0];
}

// 유저 존재 여부 check
async function checkUserExist(connection, userId) {
  const query = `
                select exists(select id from User where id = ?) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 카테고리 존재 여부 check
async function checkCategoryExist(connection, categoryId) {
  const query = `
                select exists(select id from StoreCategory where id = ?) as exist;
                `;

  const row = await connection.query(query, categoryId);

  return row[0][0]["exist"];
}

// 새로 들어왔어요 목록 조회
async function selectNewStore(connection, params) {
  const query = `
                select s.storeName, smi.imageURL, ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                      concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee
                from Store s
                    left join StoreMainImage smi on s.id = smi.storeId
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId,
                    User u
                where u.id = ?
                and s.categoryId = ?
                and smi.isDeleted = 1
                and smi.number = 1
                and sdp.rn = 1
                and s.status = 1
                and s.isDeleted = 1
                and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                and timestampdiff(day, s.createdAt, now()) <= 30
                order by s.createdAt desc
                limit 10;
                `;

  const row = await connection.query(query, params);

  return row[0];
}

module.exports = {
  selectFoodCategory,
  checkUserExist,
  checkCategoryExist,
  selectNewStore,
};
