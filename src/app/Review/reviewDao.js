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
                        replace(group_concat(sm.menuName order by c.id), ',', '·') as menu,
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

  const row1 = await connection.query(query1, storeId);
  const row2 = await connection.query(query2, storeId);

  const result = { storeInfo: row1[0], reviewList: row2[0] };

  return result;
}

// 주문과 회원 일치 여부 check
async function checkUsersOrder(connection, userId, orderId) {
  const query = `
                select exists(select id
                              from OrderList
                              where id = ?
                              and userId = ?) as exist;
                `;

  const row = await connection.query(query, [orderId, userId]);

  return row[0][0]["exist"];
}

// 주문 존재 여부 check
async function checkOrderExist(connection, orderId) {
  const query = `
                select exists(select id from OrderList where id = ?) as exist;
                `;

  const row = await connection.query(query, orderId);

  return row[0][0]["exist"];
}

// 주문 취소 여부 check
async function checkOrderDeleted(connection, orderId) {
  const query = `
                select isDeleted
                from OrderList
                where id = ?;
                `;

  const row = await connection.query(query, orderId);

  return row[0][0]["isDeleted"];
}

// 리뷰 존재 여부 check
async function checkReviewExistByOrderId(connection, orderId) {
  const query = `
                select reviewStatus
                from OrderList
                where id = ?
                and isDeleted = 1;
                `;

  const row = await connection.query(query, orderId);

  return row[0][0]["reviewStatus"];
}

// 리뷰 작성
async function createReview(
  connection,
  userId,
  orderId,
  imageURL,
  contents,
  point
) {
  const getStoreIdQuery = `
                select storeId
                from OrderList
                where id = ?;
                `;

  const getStoreIdRow = await connection.query(getStoreIdQuery, orderId);

  const storeId = getStoreIdRow[0][0]["storeId"];

  if (imageURL === "") {
    const query1 = `
                  insert into Review (userId, orderId, storeId,
                                      contents, point)
                  values (?, ?, ?, ?, ?);
                  `;

    const row1 = await connection.query(query1, [
      userId,
      orderId,
      storeId,
      contents,
      point,
    ]);

    const query2 = `
                    update OrderList
                    set reviewStatus = 1
                    where id = ?;
                    `;

    await connection.query(query2, orderId);

    return row1[0];
  } else {
    const query1 = `
                  insert into Review (userId, orderId, storeId,
                                      imageURL, contents, point, isPhoto)
                  values (?, ?, ?, ?, ?, ?, 1);
                  `;

    const row1 = await connection.query(query1, [
      userId,
      orderId,
      storeId,
      imageURL,
      contents,
      point,
    ]);

    const query2 = `
                    update OrderList
                    set reviewStatus = 1
                    where id = ?;
                    `;

    await connection.query(query2, orderId);

    return row1[0];
  }
}

// 리뷰 존재 여부 check
async function checkReviewExistByReviewId(connection, reviewId) {
  const query = `
                select exists(select id
                              from Review
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, reviewId);

  return row[0][0]["exist"];
}

// 리뷰 작성자 여부 check
async function checkReviewHost(connection, userId, reviewId) {
  const query = `
                select exists(select id
                              from Review
                              where userId = ?
                              and id = ?) as exist;
                `;

  const row = await connection.query(query, [userId, reviewId]);

  return row[0][0]["exist"];
}

// 리뷰 삭제
async function deleteReview(connection, reviewId) {
  const query = `
                update Review
                set isDeleted = 0
                where id = ?;
                `;

  const row = await connection.query(query, reviewId);

  return row[0].info;
}

// 리뷰 신고
async function reportReview(
  connection,
  userId,
  reviewId,
  selectReasonArr,
  commentReason
) {
  const query1 = `
                  insert into ReviewReported (userId, reviewId, commentReason)
                  values (?, ?, ?);
                  `;

  const row1 = await connection.query(query1, [
    userId,
    reviewId,
    commentReason,
  ]);

  const getReportIdQuery = `
                            select id
                            from ReviewReported
                            where userId = ?
                            and reviewId = ?;
                            `;

  const getReportIdRow = await connection.query(getReportIdQuery, [
    userId,
    reviewId,
  ]);

  const reportId = getReportIdRow[0][0]["id"];

  let insertCount = 0;

  for (let i = 0; i < selectReasonArr.length; i++) {
    const query2 = `
                    insert into ReviewReportedSelectedReason (reportId, reasonNum)
                    values (?, ?);
                    `;

    const row2 = await connection.query(query2, [reportId, selectReasonArr[i]]);

    if (row2[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  return { reportResult: row1[0], selectedReasonCount: insertCount };
}

// 해당 유저가 이미 신고했는지 check
async function checkAlreadyReport(connection, userId, reviewId) {
  const query = `
                select exists(select id
                              from ReviewReported
                              where userId = ?
                              and reviewId = ?) as exist;
                `;

  const row = await connection.query(query, [userId, reviewId]);

  return row[0][0]["exist"];
}

// 내가 작성한 리뷰 조회
async function selectMyReview(connection, orderId) {
  const query = `
                select r.id as reviewId, s.storeName, r.point,
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
                      replace(group_concat(sm.menuName order by c.id), ',', '·') as menu, ifnull(rlc.count, 0) as likeCount
                from Review r
                    left join OrderList ol on r.orderId = ol.id
                    left join Store s on s.id = r.storeId
                    left join Cart c on ol.id = c.orderId
                    left join StoreMenu sm on sm.id = c.menuId
                    left join (select reviewId, count(reviewId) as count
                              from ReviewLike
                              where isDeleted = 1
                              group by reviewId) as rlc on r.id = rlc.reviewId
                where r.orderId = ?;
                `;

  const row = await connection.query(query, orderId);

  return row[0];
}

// 리뷰 수정
async function modifyReview(connection, reviewId, point, contents, imageURL) {
  if (imageURL === "") {
    const query1 = `
                    update Review
                    set point = ?, contents = ?, imageURL = null, isPhoto = 0
                    where id = ?
                  `;

    const row1 = await connection.query(query1, [point, contents, reviewId]);

    return row1[0].info;
  } else {
    const query1 = `
                    update Review
                    set point = ?, contents = ?, imageURL = ?, isPhoto = 1
                    where id = ?
                  `;

    const row1 = await connection.query(query1, [
      point,
      contents,
      imageURL,
      reviewId,
    ]);

    return row1[0].info;
  }
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

module.exports = {
  checkUserExist,
  checkStoreExist,
  selectPhotoReviews,
  selectReviewList,
  checkUsersOrder,
  checkOrderExist,
  checkOrderDeleted,
  checkReviewExistByOrderId,
  createReview,
  checkReviewExistByReviewId,
  checkReviewHost,
  deleteReview,
  reportReview,
  checkAlreadyReport,
  selectMyReview,
  modifyReview,
  checkUserBlocked,
  checkUserWithdrawn,
};
