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

// 메뉴 존재 여부 check
async function checkMenuExist(connection, menuId) {
  const query = `
                select exists(select id
                              from StoreMenu
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, menuId);

  return row[0][0]["exist"];
}

// // 메뉴 삭제 여부 check
// async function checkMenuDeleted(connection, menuId) {
//   const query = `
//                 select isDeleted
//                 from StoreMenu
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, menuId);

//   return row[0][0]["isDeleted"];
// }

// 카트에 담기
async function createCart(
  connection,
  userId,
  storeId,
  menuId,
  amount,
  subIdArr
) {
  const existCheckQuery = `
                          select rootId, menuId
                          from Cart
                          where rootId = ?
                          and isDeleted = 1
                          and userId = ?
                          order by menuId;
                          `;

  const existCheckRow = await connection.query(existCheckQuery, [
    menuId,
    userId,
  ]);

  let existMainId;
  let existSubArr = [];

  if (existCheckRow[0].length !== 0) {
    existMainId = existCheckRow[0][0]["rootId"];

    for (let i = 1; i < existCheckRow[0].length; i++) {
      existSubArr.push(existCheckRow[0][i]["menuId"]);
    }
  }

  let same = 1;

  if ((existMainId === menuId) & (existSubArr.length === subIdArr.length)) {
    for (let i = 0; i < subIdArr.length; i++) {
      if (existSubArr[i] !== subIdArr[i]) {
        same = 0;
        break;
      }
    }
  }

  if (same === 1) {
    const query = `
                  update Cart
                  set amount = amount + ?
                  where userId = ?
                  and rootId = ?
                  and isDeleted = 1;
                  `;

    const row = await connection.query(query, [amount, userId, menuId]);

    return `Same Menu -> add mount: ${amount}`;
  }

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
    const subQuery = `
                    insert into Cart (userId, storeId, rootId, menuId, amount)
                    values (?, ?, ?, ?, ?);
                    `;

    const subRow = await connection.query(subQuery, [
      userId,
      storeId,
      menuId,
      menuId,
      amount,
    ]);

    if (subRow[0].affectedRows === 1) {
      insertCount += 1;
    }
  }

  return { menuInsertResult: mainRow[0], subMenuInsertCount: insertCount };
}

// 카트 상태 check
async function checkCartExist(connection, userId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 같은 음식점의 메뉴 여부 check
async function checkSameStore(connection, userId, storeId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and storeId = ?
                              and isDeleted = 1) as exist;
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

// 카트에 다른 상점이 이미 있는지 check
async function checkOtherStoreExist(connection, userId, storeId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and storeId != ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, storeId]);

  return row[0][0]["exist"];
}

// 카트에 메뉴 존재 여부 check
async function checkMenuExistAtCart(connection, userId, rootId) {
  const query = `
                select exists(select id
                              from Cart
                              where userId = ?
                              and rootId = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, [userId, rootId]);

  return row[0][0]["exist"];
}

// 메뉴 수량 변경
async function changeMenuAmount(connection, userId, rootId, amount) {
  const query = `
                update Cart
                set amount = ?
                where userId = ?
                and rootId = ?;
                `;

  const row = await connection.query(query, [amount, userId, rootId]);

  return row[0].info;
}

// 카트 비우기
async function cleanUpCart(connection, userId) {
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
  checkMenuExist,
  createCart,
  checkCartExist,
  checkSameStore,
  deleteOtherStore,
  checkOtherStoreExist,
  checkMenuExistAtCart,
  changeMenuAmount,
  cleanUpCart,
};
