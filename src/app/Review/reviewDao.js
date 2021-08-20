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

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
};
