// 유저 존재 여부 확인
async function checkUserExist(connection, userId) {
  const query = `
    select exists(select id from User where id = ?) as exist;
    `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// 주소 추가
async function insertAddress(connection, params) {
  const query = `
                insert into Address(userId, type, nickname, budildingName, address,
                                    detailAddress, information,
                                    addressLatitude, addressLongtitude)
                values (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, params);

  return row[0];
}

// 주소 존재 여부 확인
async function checkAddressExist(connection, addressId) {
  const query = `
    select exists(select id from Address where id = ?) as exist;
    `;

  const row = await connection.query(query, addressId);

  return row[0][0]["exist"];
}

// 주소 수정
async function updateAddress(connection, params) {
  const query = `
                update Address
                set type = ?, nickname = ?, buildingName = ?, address = ?,
                    detailAddress = ?, information = ?,
                    addressLatitude = ?, addressLongtitude = ?
                where id = ?;
                `;

  const row = await connection.query(query, params);

  return row[0].info;
}

// 주소 삭제
async function deleteAddress(connection, addressId) {
  const query = `
                update Address
                set isDeleted = 0
                where id = ?;
                `;

  const row = await connection.query(query, addressId);

  return row[0].info;
}

// 주소 목록 조회
async function selectAddress(connection, userId) {
  const query = `
                select case
                          when nickname != ''
                              then nickname
                          when buildingName != ''
                              then buildingName
                          else
                              address
                      end as nickname, address
                from Address
                where isDeleted = 1
                and userId= ?;
                `;

  const row = await connection.query(query, userId);

  return row[0];
}

module.exports = {
  checkUserExist,
  insertAddress,
  checkAddressExist,
  updateAddress,
  deleteAddress,
  selectAddress,
};
