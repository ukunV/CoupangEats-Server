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
  const checkQuery = `
                      select rootId
                      from Cart
                      where storeId = ?
                      and rootId = menuId
                      and isDeleted = 1;
                      `;

  const checkRow = await connection.query(checkQuery, storeId);

  const mainQuery = `
                insert into Cart (userId, storeId, rootId, menuId, amount)
                values (?, ?, ?, ?, ?);
                `;

  let mainRow;

  let subParams;

  if (checkRow[0].length === 0) {
    mainRow = await connection.query(mainQuery, [
      userId,
      storeId,
      menuId,
      menuId,
      amount,
    ]);

    subParams = [userId, storeId, menuId];
  } else {
    mainRow = await connection.query(mainQuery, [
      userId,
      storeId,
      checkRow[0][0]["rootId"],
      menuId,
      amount,
    ]);

    subParams = [userId, storeId, checkRow[0][0]["rootId"]];
  }

  let insertCount = 0;

  for (let i = 0; i < subIdArr.length; i++) {
    const subQuery = `
                    insert into Cart (userId, storeId, rootId, menuId, amount)
                    values (?, ?, ?, ?, ?);
                    `;

    subParams.push(subIdArr[i]);
    subParams.push(amount);

    const subRow = await connection.query(subQuery, subParams);

    subParams.pop();
    subParams.pop();

    if (subRow[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  return { menuInsertResult: mainRow[0], subMenuInsertCount: insertCount };
}

// 카트 상태 check
async function checkCartExist(connection, userId) {
  const query = `
                 select exists(select id from Cart
                              where userId = ? and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 같은 음식점의 메뉴 여부 check
async function checkSameStore(connection, userId, storeId) {
  const query = `
                 select exists(select id from Cart
                              where userId = ? and storeId = ? and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, storeId]);

  return row[0][0]["exist"];
}

// 타 음식점 메뉴 카트에 담을 시 카트 항목 삭제
async function deleteOtherStore(connection, userId) {
  const query = `
                update Cart
                set isDeleted = 0
                where userId = ?;
                `;

  const row = await connection.query(query, userId);

  return row[0].info;
}

module.exports = {
  checkUserExist,
  checkStoreExist,
  checkStoreDeleted,
  checkMenuExist,
  checkMenuDeleted,
  createCart,
  checkCartExist,
  checkSameStore,
  deleteOtherStore,
};
