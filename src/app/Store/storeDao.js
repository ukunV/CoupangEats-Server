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

// 음식점 조회 by categoryId
async function selectStoresByCategoryId(
  connection,
  userId,
  categoryCondition,
  page,
  size,
  filterCondition,
  cheetahCondition,
  deliveryFeeCondition,
  minPriceCondition
) {
  const query = `
                select group_concat(smi.imageURL) as imageArray,
                      s.storeName, concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime,
                      round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                      concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                      case
                          when sdp.price = 0
                              then '무료배달'
                          else
                              concat('배달비 ', format(sdp.price, 0), '원')
                      end as deliveryFee,
                      s.isCheetah,
                      case
                          when timestampdiff(day, s.createdAt, now()) <= 30
                              then 1
                          else
                              0
                      end as isNew
                from Store s
                    left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                    left join (select storeId, count(storeId) as count, avg(point) as point
                              from Review
                              where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                    left join (select storeId, count(storeId) as count
                              from OrderList
                              where isDeleted = 1 group by storeId) as oc on s.id = oc.storeId
                    left join StoreMainImage smi on s.id = smi.storeId,
                    User u
                where u.id = ?
                ${categoryCondition}
                and s.isDeleted = 1
                and smi.isDeleted = 1
                and sdp.rn = 1
                and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                ${cheetahCondition}
                ${deliveryFeeCondition}
                ${minPriceCondition}
                group by s.id
                ${filterCondition}
                limit ${page}, ${size};
                `;

  const row = await connection.query(query, userId);

  return row[0];
}

// 음식점 존재 여부 check
async function checkStoreExist(connection, storeId) {
  const query = `
                select exists(select id from Store where id = ?) as exist;
                `;

  const row = await connection.query(query, storeId);

  return row[0][0]["exist"];
}

// 음식점 상세페이지 조회
async function selectStore(connection, storeId) {
  const query1 = `
                  select group_concat(smi.imageURL) as imageArray, s.storeName,
                        round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                        concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime, s.isCheetah,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        concat(format(sdp.orderPrice, 0), '원') as minPrice
                  from Store s
                      left join StoreMainImage smi on s.id = smi.storeId
                      left join (select *, row_number() over (partition by storeId order by price) as rn
                              from StoreDeliveryPrice
                              where isDeleted = 1) as sdp on s.id = sdp.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId,
                      User u
                  where s.id = ?
                  and sdp.rn = 1
                  and s.isDeleted = 1
                  and smi.isDeleted = 1
                  group by s.id;
                  `;

  const query2 = `
                  select r.imageURL, r.point, r.createdAt,
                        case
                            when length(r.contents) > 35
                                then concat(left(r.contents, 35), '...')
                            else
                                r.contents
                        end as contents
                  from Review r
                  where r.storeId = ?
                  and r.isPhoto = 1
                  and r.isDeleted = 1
                  order by createdAt desc
                  limit 3;
                  `;

  const query3 = `
                  select menuCategoryName, menuCategoryNumber, menuNumber,
                        sm.menuName, smi.imageURL, sm.description
                  from StoreMenu sm
                      left join StoreMenuImage smi on sm.id = smi.menuId
                  where sm.storeId = ?
                  and smi.number = 1
                  order by menuCategoryNumber, menuNumber;
                  `;

  const result1 = await connection.query(query1, storeId);
  const result2 = await connection.query(query2, storeId);
  const result3 = await connection.query(query3, storeId);

  const info = JSON.parse(JSON.stringify(result1[0]));
  const photoReview = JSON.parse(JSON.stringify(result2[0]));
  const mainMenu = JSON.parse(JSON.stringify(result3[0]));

  const row = {
    info,
    photoReview,
    mainMenu,
  };

  return row;
}

module.exports = {
  selectFoodCategory,
  checkUserExist,
  checkCategoryExist,
  selectNewStore,
  selectStoresByCategoryId,
  checkStoreExist,
  selectStore,
};
