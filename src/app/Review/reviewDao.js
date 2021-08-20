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

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
  selectPhotoReviews,
};
