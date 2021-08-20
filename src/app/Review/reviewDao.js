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

// 최근 포토 리뷰 3개 조회
async function selectPhotoReviews(connection, storeId) {
  const query = `
                select id as reviewId, imageURL, point, contents
                from Review
                where storeId = ?
                and isPhoto = 1
                and isDeleted = 1
                order by createdAt desc
                limit 3;
                `;

  const row = await connection.query(query, storeId);

  return row[0];
}

// 리뷰 조회
async function selectReviewList(
  connection,
  storeId,
  page,
  size,
  condition,
  photoCondition
) {
  const query1 = `
                  select round(ifnull(avg(point), 0.0), 1) as avgPoint,
                        count(storeId) as reviewCount
                  from Review
                  where storeId = ?
                  and isDeleted = 1
                  group by storeId;
                  `;

  const query2 = `
                  select r.id as reviewId,
                        concat(left(u.name, 1), '**') as name, r.point,
                        group_concat(sm.menuName order by c.id) as menu,
                        case
                            when timestampdiff(month, r.createdAt, now()) = 1
                                then '지난 달'
                            when timestampdiff(day, r.createdAt, now()) > 13
                                then '이번 달'
                            when timestampdiff(day, r.createdAt, now()) > 6
                                then '지난 주'
                            when timestampdiff(day, r.createdAt, now()) = 6
                                then '6일 전'
                            when timestampdiff(day, r.createdAt, now()) = 5
                                then '5일 전'
                            when timestampdiff(day, r.createdAt, now()) = 4
                                then '4일 전'
                            when timestampdiff(day, r.createdAt, now()) = 3
                                then '3일 전'
                            when timestampdiff(day, r.createdAt, now()) = 2
                                then '2일 전'
                            when timestampdiff(day, r.createdAt, now()) = 1
                                then '1일 전'
                            when timestampdiff(day, r.createdAt, now()) = 0
                                then '오늘'
                            else
                                date_format(r.createdAt, '%Y-%m-%d')
                        end as createdAt,
                        r.imageURL, r.contents,
                        ifnull(rlc.count, 0) as likeCount, ifnull(rdc.count, 0) as dislikeCount
                  from Review r
                      left join User u on r.userId = u.id
                      left join OrderList ol on ol.id = r.orderId
                      left join Cart c on c.orderId = ol.id
                      left join StoreMenu sm on sm.id = c.menuId
                      left join (select reviewId, count(reviewId) as count
                                from ReviewLike
                                where isDeleted = 1
                                group by reviewId) as rlc on r.id = rlc.reviewId
                      left join (select reviewId, count(reviewId) as count
                                from ReviewDislike
                                where isDeleted = 1
                                group by reviewId) as rdc on r.id = rdc.reviewId
                  where r.isDeleted = 1
                  and r.storeId = ?
                  ${photoCondition}
                  group by r.id
                  ${condition}
                  limit ${page}, ${size};
                `;

  const result1 = await connection.query(query1, storeId);
  const result2 = await connection.query(query2, storeId);

  const storeInfo = JSON.parse(JSON.stringify(result1[0]));
  const reviewList = JSON.parse(JSON.stringify(result2[0]));

  const row = { storeInfo, reviewList };

  return row;
}

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
  selectPhotoReviews,
  selectReviewList,
};
