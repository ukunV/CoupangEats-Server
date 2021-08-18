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

// 메뉴 존재 여부 check
async function checkMenuExist(connection, menuId) {
  const query = `
                select exists(select id from StoreMenu where id = ?) as exist;
                `;

  const row = await connection.query(query, menuId);

  return row[0][0]["exist"];
}

// 메뉴 삭제 여부 check
async function checkMenuDeleted(connection, menuId) {
  const query = `
                select isDeleted
                from StoreMenu
                where id = ?;
                `;

  const row = await connection.query(query, menuId);

  return row[0][0]["isDeleted"];
}

// 카트에 담기
async function createCart(
  connection,
  userId,
  storeId,
  menuId,
  amount,
  subIdArr
) {
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
    const query = `
                    insert into Cart (userId, storeId, rootId, menuId, amount)
                    values (?, ?, ?, ?, ?);
                    `;

    const row = await connection.query(query, [
      userId,
      storeId,
      menuId,
      subIdArr[i],
      amount,
    ]);

    if (row[0].affectedRows == 1) {
      insertCount += 1;
    }
  }

  return { menuInsertResult: mainRow[0], subMenuInsertCount: insertCount };
}

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
  checkMenuExist,
  checkMenuDeleted,
  createCart,
};
