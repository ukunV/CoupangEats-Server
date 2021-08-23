// 주문 배달완료 여부 check
async function checkOrderAlive(connection, orderId) {
  const query = `
                  select exists(select id
                                from OrderList
                                where id = ?
                                and status != 0
                                and status != 5) as exist;
                  `;

  const row = await connection.query(query, orderId);

  return row[0][0]["exist"];
}

// 라이더 위치 갱신
async function updateRiderLocation(connection, orderId, lat, lng) {
  const query = `
                  update RiderLocation
                  set riderLatitude = ?, riderLongtitude = ?
                  where orderId = ?;
                  `;

  const row = await connection.query(query, [lat, lng, orderId]);

  return row[0].info;
}

// 주문 상태 check (status = 1)
async function checkOrderStatus(connection, orderId, status) {
  const query = `
                  select exists(select id
                                from OrderList
                                where id = ?
                                and status ?) as exist;
                  `;

  const row = await connection.query(query, [orderId, status]);

  return row[0][0]["exist"];
}

module.exports = {
  checkOrderAlive,
  updateRiderLocation,
  checkOrderStatus,
};
