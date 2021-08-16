// 음식 카테고리 조회
async function selectFoodCategory(connection) {
  const query = `
                select id, categoryName, imageURL
                from StoreCategory;
                `;

  const row = await connection.query(query);

  return row[0];
}

// 카테고리 존재 여부 check
async function checkCategoryExist(connection, categoryId) {
  const query = `
                select exists(select id from StoreCategory where id = ?) as exist;
                `;

  const row = await connection.query(query, categoryId);

  return row[0][0]["exist"];
}

module.exports = {
  selectFoodCategory,
  checkCategoryExist,
};
