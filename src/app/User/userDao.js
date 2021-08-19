// 이메일 존재 여부 확인
async function checkEmailExist(connection, email) {
  const query = `
    select exists(select email from User where email = ?) as exist;
    `;

  const row = await connection.query(query, email);

  return row[0][0]["exist"];
}

// 전화번호 존재 여부 확인
async function checkPhoneNumExist(connection, phoneNum) {
  const query = `
    select exists(select phoneNum from User where phoneNum = ?) as exist;
    `;

  const row = await connection.query(query, phoneNum);

  return row[0][0]["exist"];
}

// 회원가입
async function createUser(connection, params) {
  const query = `
                insert into User(email, password, salt, name, phoneNum)
                values (?, ?, ?, ?, ?);
                `;

  const row = await connection.query(query, params);

  return row[0];
}

// salt값 가져오기
async function getSalt(connection, email) {
  const query = `
                select salt
                from User
                where email = ?;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["salt"];
}

// 비밀번호 확인
async function checkPassword(connection, params) {
  const query = `
                select ifnull(id, 0) as id
                from User
                where email = ? and password = ?;
                `;

  const row = await connection.query(query, params);

  return row[0][0]["id"];
}

// 유저 존재 여부 확인
async function checkUserExist(connection, userId) {
  const query = `
    select exists(select id from User where id = ?) as exist;
    `;

  const row = await connection.query(query, userId);

  return row[0][0]["exist"];
}

// // 유저 주소 변경
// async function updateAddress(connection, params) {
//   const query = `
//                 update User
//                 set userLatitude = ?, userLongtitude = ?
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, params);

//   return row[0].info;
// }

// 홈 화면 조회
async function selectHome(connection, userId) {
  const query1 = `
                  select case
                          when a.nickname != '' and a.nickname is not null
                              then a.nickname
                          when a.buildingName != '' and a.buildingName is not null
                              then a.buildingName
                        else
                            a.address
                        end as nickname
                  from User u
                      left join (select * from Address where isDeleted = 1) as a on u.id = a.userId
                  where a.addressLatitude = u.userLatitude
                  and a.addressLongtitude = u.userLongtitude
                  and u.id= ?;
                  `;

  const query2 = `
                  select subImageURL as eventImageURL, ROW_NUMBER() over (order by createdAt desc) AS number
                  from Event
                  where status = 1
                  order by createdAt desc;
                  `;

  const query3 = `
                  select id, categoryName, imageURL as categoryImageURL
                  from StoreCategory;
                  `;

  const query4 = `
                  select s.id as storeId, s.storeName, smi.imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        case
                            when c.discount is not null
                                then concat(format(c.discount, 0), '원 쿠폰')
                            else
                                '쿠폰 없음'
                        end as coupon
                  from Store s
                      left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                      left join (select storeId, count(storeId) as count
                                from OrderList
                                where isDeleted = 1 group by storeId) as oc on s.id = oc.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join (select storeId, min(price) as price
                                from StoreDeliveryPrice
                                where isDeleted = 1
                                group by storeId) as sdp on s.id = sdp.storeId
                      left join Franchise f on f.id = s.franchiseId
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id,
                  User u
                  where u.id = ?
                  and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                  and s.isDeleted = 1
                  and s.status = 1
                  group by s.id
                  order by oc.count desc;
                  `;

  const query5 = `
                  select s.id as storeId, s.storeName,
                        case
                            when f.franchiseImageURL != '' or f.franchiseImageURL is not null
                                then f.franchiseImageURL
                            else
                                smi.imageURL
                        end as imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        case
                            when c.discount is not null
                                then concat(format(c.discount, 0), '원 쿠폰')
                            else
                                '쿠폰 없음'
                        end as coupon
                  from Store s
                      left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                      left join Franchise f on s.franchiseId = f.id
                      left join (select storeId, count(storeId) as count
                                from OrderList
                                where isDeleted = 1 group by storeId) as oc on s.id = oc.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join (select storeId, min(price) as price
                                from StoreDeliveryPrice
                                where isDeleted = 1
                                group by storeId) as sdp on s.id = sdp.storeId
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id,
                      User u
                  where u.id = ?
                  and s.isDeleted = 1
                  and s.status = 1
                  and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                  and s.franchiseId != 0
                  group by s.id
                  order by oc.count desc
                  limit 10;
                  `;

  const query6 = `
                  select s.id as storeId, s.storeName, smi.imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        case
                            when c.discount is not null
                                then concat(format(c.discount, 0), '원 쿠폰')
                            else
                                '쿠폰 없음'
                        end as coupon
                  from Store s
                      left join (select * from StoreMainImage where isDeleted = 1 and number = 1) as smi on s.id = smi.storeId
                      left join (select storeId, min(price) as price
                            from StoreDeliveryPrice
                            where isDeleted = 1
                            group by storeId) as sdp on s.id = sdp.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                            from Review
                            where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join Franchise f on f.id = s.franchiseId
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id,
                      User u
                  where u.id = ?
                  and s.status = 1
                  and s.isDeleted = 1
                  and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                  order by s.createdAt desc
                  limit 10;
                  `;

  const query7 = `
                select count(*) as cheetahCount
                from Store s, User u
                where u.id = ?
                and getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                and s.isCheetah = 1;
                `;

  const result1 = await connection.query(query1, userId);
  const result2 = await connection.query(query2);
  const result3 = await connection.query(query3);
  const result4 = await connection.query(query4, userId);
  const result5 = await connection.query(query5, userId);
  const result6 = await connection.query(query6, userId);
  const result7 = await connection.query(query7, userId);

  const userAddress = JSON.parse(JSON.stringify(result1[0]));
  const eventList = JSON.parse(JSON.stringify(result2[0]));
  const categoryList = JSON.parse(JSON.stringify(result3[0]));
  const bestStore = JSON.parse(JSON.stringify(result4[0]));
  const bestFranchise = JSON.parse(JSON.stringify(result5[0]));
  const newStore = JSON.parse(JSON.stringify(result6[0]));
  const cheetahCount = JSON.parse(JSON.stringify(result7[0]));

  const row = {
    userAddress,
    eventList,
    categoryList,
    bestStore,
    bestFranchise,
    newStore,
    cheetahCount,
  };

  return row;
}

// 이벤트 목록 조회
async function selectEventList(connection, userId) {
  const query = `
                select e.id as eventId, e.subImageURL, date_format(e.endDate, '~ %m.%d 까지') as endDate,
                      min(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1)) as distance
                from Event e
                    left join Franchise f on e.franchiseId = f.id
                    left join Store s on s.franchiseId = f.id,
                    User u
                where u.id = ?
                and e.status = 1
                and (getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                or getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) is null)
                group by e.id
                order by e.endDate is null asc, e.endDate asc, e.createdAt desc;
                `;

  const row = await connection.query(query, userId);

  return row[0];
}
module.exports = {
  checkEmailExist,
  checkPhoneNumExist,
  createUser,
  getSalt,
  checkPassword,
  checkUserExist,
  selectHome,
  selectEventList,
};
