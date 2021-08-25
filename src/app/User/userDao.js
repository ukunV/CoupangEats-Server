// 이메일 존재 여부 확인
async function checkEmailExist(connection, email) {
  const query = `
                select exists(select email
                              from User
                              where email = ?) as exist;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["exist"];
}

// 전화번호 존재 여부 확인
async function checkPhoneNumExist(connection, phoneNum) {
  const query = `
                select exists(select phoneNum
                              from User
                              where phoneNum = ?
                              and status in (1, 2)) as exist;
                `;

  const row = await connection.query(query, phoneNum);

  return row[0][0]["exist"];
}

// 회원가입
async function createUser(connection, params) {
  const query = `
                insert into User(email, salt, password, name,
                                phoneNum, userLatitude, userLongtitude)
                values (?, ?, ?, ?, ?, ?, ?);
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
                select exists(select id
                              from User
                              where id = ?) as exist;
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

// 홈 화면 조회 by userId
async function selectHomeByUserId(connection, userId) {
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
                      left join (select *
                                from Address
                                where isDeleted = 1
                                and isChecked = 1) as a on u.id = a.userId
                  where a.addressLatitude = u.userLatitude
                  and a.addressLongtitude = u.userLongtitude
                  and u.id= ?;
                  `;

  const query2 = `
                  select e.subImageURL as eventImageURL, ROW_NUMBER() over (order by e.createdAt desc) AS number
                  from Event e
                      left join Franchise f on e.franchiseId = f.id
                      left join (select * from Store where isDeleted = 1) as s on s.franchiseId = f.id,
                      User u
                  where u.id = ?
                  and e.status = 1
                  and (getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) <= 4
                  or getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude) is null)
                  group by e.id
                  order by e.endDate is null asc, e.endDate asc, e.createdAt desc;
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
                                where status != 0 group by storeId) as oc on s.id = oc.storeId
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
                  order by oc.count desc
                  limit 10;
                  `;

  const query5 = `
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
                      left join Franchise f on s.franchiseId = f.id
                      left join (select storeId, count(storeId) as count
                                from OrderList
                                where status != 0 group by storeId) as oc on s.id = oc.storeId
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
                  and s.franchiseId is not null
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

  const row1 = await connection.query(query1, userId);
  const row2 = await connection.query(query2, userId);
  const row3 = await connection.query(query3);
  const row4 = await connection.query(query4, userId);
  const row5 = await connection.query(query5, userId);
  const row6 = await connection.query(query6, userId);
  const row7 = await connection.query(query7, userId);

  const result = {
    userAddress: row1[0],
    eventList: row2[0],
    categoryList: row3[0],
    bestStore: row4[0],
    bestFranchise: row5[0],
    newStore: row6[0],
    cheetahCount: row7[0],
  };

  return result;
}

// 홈 화면 조회 by address
async function selectHomebyAddress(connection, lat, lng) {
  const query1 = `
                  select e.subImageURL as eventImageURL, ROW_NUMBER() over (order by e.createdAt desc) AS number
                  from Event e
                      left join Franchise f on e.franchiseId = f.id
                      left join (select * from Store where isDeleted = 1) as s on s.franchiseId = f.id
                  where e.status = 1
                  and (getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                  or getDistance(?, ?, s.storeLatitude, s.storeLongtitude) is null)
                  group by e.id
                  order by e.endDate is null asc, e.endDate asc, e.createdAt desc;
                  `;

  const query2 = `
                  select id, categoryName, imageURL as categoryImageURL
                  from StoreCategory;
                  `;

  const query3 = `
                  select s.id as storeId, s.storeName, smi.imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(?, ?, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
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
                                where status != 0 group by storeId) as oc on s.id = oc.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join (select storeId, min(price) as price
                                from StoreDeliveryPrice
                                where isDeleted = 1
                                group by storeId) as sdp on s.id = sdp.storeId
                      left join Franchise f on f.id = s.franchiseId
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id
                  where getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                  and s.isDeleted = 1
                  and s.status = 1
                  group by s.id
                  order by oc.count desc
                  limit 10;
                  `;

  const query4 = `
                  select s.id as storeId, s.storeName, smi.imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(?, ?, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
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
                                where status != 0 group by storeId) as oc on s.id = oc.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join (select storeId, min(price) as price
                                from StoreDeliveryPrice
                                where isDeleted = 1
                                group by storeId) as sdp on s.id = sdp.storeId
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id
                  where s.isDeleted = 1
                  and s.status = 1
                  and getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                  and s.franchiseId != 0
                  group by s.id
                  order by oc.count desc
                  limit 10;
                  `;

  const query5 = `
                  select s.id as storeId, s.storeName, smi.imageURL,
                        ifnull(rc.count, 0) as reviewCount, round(ifnull(rc.point, 0.0), 1) as avgPoint,
                        concat(format(getDistance(?, ?, s.storeLatitude, s.storeLongtitude), 1), 'km') as distance,
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
                      left join (select * from Coupon where status = 1 or status is null) as c on c.franchiseId = f.id
                  where s.status = 1
                  and s.isDeleted = 1
                  and getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                  order by s.createdAt desc
                  limit 10;
                  `;

  const query6 = `
                select count(*) as cheetahCount
                from Store
                where getDistance(?, ?, s.storeLatitude, s.storeLongtitude) <= 4
                and isCheetah = 1;
                `;

  const row1 = await connection.query(query1, [lat, lng, lat, lng, lat, lng]);
  const row2 = await connection.query(query2);
  const row3 = await connection.query(query3, [lat, lng, lat, lng]);
  const row4 = await connection.query(query4, [lat, lng, lat, lng]);
  const row5 = await connection.query(query5, [lat, lng, lat, lng]);
  const row6 = await connection.query(query6, [lat, lng]);

  const result = {
    currentAddress: address,
    eventList: row1[0],
    categoryList: row2[0],
    bestStore: row3[0],
    bestFranchise: row4[0],
    newStore: row5[0],
    cheetahCount: row6[0],
  };

  return result;
}

// 이벤트 목록 조회
async function selectEventList(connection, userId) {
  const query = `
                select e.id as eventId, e.subImageURL, date_format(e.endDate, '~ %m.%d 까지') as endDate,
                      min(format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1)) as distance
                from Event e
                    left join Franchise f on e.franchiseId = f.id
                    left join (select * from Store where isDeleted = 1) as s on s.franchiseId = f.id,
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

// 이벤트 존재 여부 check
async function checkEventExist(connection, eventId) {
  const query = `
                select exists(select id
                              from Event
                              where id = ?
                              and status = 1) as exist;
                `;

  const row = await connection.query(query, eventId);

  return row[0][0]["exist"];
}

// // 이벤트 상태 check
// async function checkEventStatus(connection, eventId) {
//   const query = `
//                 select status
//                 from Event
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, eventId);

//   return row[0][0]["status"];
// }

// 이벤트 상세페이지 조회
async function selectEvent(connection, eventId, distance) {
  const query = `
                select e.imageURL, e.midDescription, e.endDescription,
                      e.franchiseId, c.number as couponNumber
                from Event e
                    left join Coupon c on c.franchiseId = e.franchiseId
                where e.id = ?;
                `;

  const row = await connection.query(query, eventId);

  const result = {
    imageURL: row[0][0]["imageURL"],
    midDescription: row[0][0]["midDescription"],
    endDescription: row[0][0]["endDescription"],
    franchiseId: row[0][0]["franchiseId"],
    couponNumber: row[0][0]["couponNumber"],
    distance,
  };

  return result;
}

// 프랜차이즈 존재 여부 check
async function checkFranchiseExist(connection, franchiseId) {
  const query = `
                select exists(select id from Franchise where id = ?) as exist;
                `;

  const row = await connection.query(query, franchiseId);

  return row[0][0]["exist"];
}

// 이벤트 페이지 스토어로 이동
async function eventToStore(connection, userId, franchiseId, distance) {
  const query1 = `
                  select s.id as storeId, group_concat(smi.imageURL) as imageArray, s.storeName,
                        case
                            when c.discount is not null
                                then concat(format(c.discount, 0), '원 쿠폰 받기')
                            else
                                '쿠폰 없음'
                        end as coupon, c.number,
                        round(ifnull(rc.point, 0.0), 1) as avgPoint, ifnull(rc.count, 0) as reviewCount,
                        concat(s.deliveryTime, '-', s.deliveryTime + 10, '분') as deliveryTime, s.isCheetah,
                        case
                            when sdp.price = 0
                                then '무료배달'
                            else
                                concat('배달비 ', format(sdp.price, 0), '원')
                        end as deliveryFee,
                        concat(format(sdp.orderPrice, 0), '원') as minPrice
                  from Store s
                      left join (select * from StoreMainImage where isDeleted = 1) as smi on s.id = smi.storeId
                      left join (select *, row_number() over (partition by storeId order by price) as rn
                                from StoreDeliveryPrice
                                where isDeleted = 1) as sdp on s.id = sdp.storeId
                      left join (select storeId, count(storeId) as count, avg(point) as point
                                from Review
                                where isDeleted = 1 group by storeId) as rc on s.id = rc.storeId
                      left join Franchise as f on f.id = s.franchiseId
                      left join (select * from Coupon where status = 1) as c on c.franchiseId = f.id,
                        User u
                  where u.id = ?
                  and f.id = ?
                  and format(getDistance(u.userLatitude, u.userLongtitude, s.storeLatitude, s.storeLongtitude), 1) = ?
                  and sdp.rn = 1
                  and s.isDeleted = 1
                  group by s.id;
                  `;

  const result1 = await connection.query(query1, [
    userId,
    franchiseId,
    distance,
  ]);

  const query2 = `
                  select sm.id as menuId, sm.menuCategoryName, sm.menuCategoryNumber,
                        sm.menuName, sm.menuNumber, concat(format(sm.price, 0), '원') as price,
                        smi.imageURL, sm.description
                  from StoreMenu sm
                      left join StoreMenuImage smi on sm.id = smi.menuId
                  where sm.storeId = ?
                  and smi.number = 1
                  order by sm.menuCategoryNumber, sm.menuNumber;
                  `;

  const result2 = await connection.query(query2, result1[0][0]["storeId"]);

  const info = JSON.parse(JSON.stringify(result1[0]));
  const mainMenu = JSON.parse(JSON.stringify(result2[0]));

  const row = {
    info,
    mainMenu,
  };

  return row;
}

// 공지사항 목록 조회
async function selectNoticeList(connection) {
  const query = `
                select id as noticeId,
                      date_format(createdAt, '%Y.%m.%d') as createdAt, title
                from Notice
                where isDeleted = 1
                order by id desc;
                `;

  const row = await connection.query(query);

  return row[0];
}

// 공지 존재 여부 check
async function checkNoticeExist(connection, noticeId) {
  const query = `
                select exists(select id
                              from Notice
                              where id = ?
                              and isDeleted = 1) as exist;
                `;

  const row = await connection.query(query, noticeId);

  return row[0][0]["exist"];
}

// // 공지 상태 check
// async function checkNoticeDeleted(connection, noticeId) {
//   const query = `
//                 select isDeleted
//                 from Notice
//                 where id = ?;
//                 `;

//   const row = await connection.query(query, noticeId);

//   return row[0][0]["isDeleted"];
// }

// 공지사항 세부페이지 조회
async function selectNotice(connection, noticeId) {
  const query = `
                select id as noticeId,
                      date_format(createdAt, '%Y.%m.%d') as createdAt, title, contents
                from Notice
                where id = ?;
                `;

  const row = await connection.query(query, noticeId);

  return row[0];
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

// 유저 존재 여부 check - 아이디 찾기
async function checkMatchUserWithPhoneNum(connection, userName, phoneNum) {
  const query = `
                select exists(select id
                              from User
                              where name = ?
                              and phoneNum = ?) as exist;
                `;

  const row = await connection.query(query, [userName, phoneNum]);

  return row[0][0]["exist"];
}

// 아이디 찾기 - 인증번호 전송 및 저장
async function updateAuthNumByPhoneNum(connection, phoneNum, authNum) {
  const query = `
                update User
                set authNum = ?
                where phoneNum = ?;
                `;

  const row = await connection.query(query, [authNum, phoneNum]);

  return row[0].info;
}

// 인증번호 일치여부 check - 아이디
async function checkAuthNumByPhoneNum(connection, phoneNum, authNum) {
  const query = `
                select exists(select id
                              from User
                              where phoneNum = ?
                              and authNum = ?) as exist;
                `;

  const row = await connection.query(query, [phoneNum, authNum]);

  return row[0][0]["exist"];
}

// 아이디 찾기 - 인증번호 확인 및 이메일 제공
async function selectEmail(connection, phoneNum) {
  const query = `
                select concat(rpad(left(substring_index(email, '@', 1), 2),
                                  char_length(substring_index(email, '@', 1)), '*'),
                              '@', substring_index(email, '@', -1)) as email
                from User
                where phoneNum = ?;
                `;

  const row = await connection.query(query, phoneNum);

  return { email: row[0][0]["email"] };
}

// 계정 정지 여부 check - 로그인
async function checkEmailBlocked(connection, email) {
  const query = `
                select exists(select id
                              from User
                              where email = ?
                              and status = 2) as exist;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["exist"];
}

// 계정 탈퇴 여부 check - 로그인
async function checkEmailWithdrawn(connection, email) {
  const query = `
                select exists(select id
                              from User
                              where email = ?
                              and status = 0) as exist;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["exist"];
}

// 유저 존재 여부 check - 비밀번호 찾기
async function checkMatchUserWithEmail(connection, userName, email) {
  const query = `
                select exists(select id
                              from User
                              where name = ?
                              and email = ?) as exist;
                `;

  const row = await connection.query(query, [userName, email]);

  return row[0][0]["exist"];
}

// 비밀번호 찾기 - 인증번호 전송 및 저장
async function selectPhoneNum(connection, email) {
  const query = `
                select phoneNum
                from User
                where email = ?;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["phoneNum"];
}

// 비밀번호 찾기 - 인증번호 전송 및 저장
async function updateAuthNumByEmail(connection, email, authNum) {
  const query = `
                update User
                set authNum = ?
                where email = ?;
                `;

  const row = await connection.query(query, [authNum, email]);

  return row[0].info;
}

// 인증번호 일치여부 check - 비밀번호
async function checkAuthNumByEmail(connection, email, authNum) {
  const query = `
                select exists(select id
                              from User
                              where email = ?
                              and authNum = ?) as exist;
                `;

  const row = await connection.query(query, [email, authNum]);

  return row[0][0]["exist"];
}

// 비밀번호 찾기 - 인증번호 확인 및 비밀번호 재설정
async function updatePassword(connection, hashedPassword, salt, email) {
  const query = `
                update User
                set password = ?, salt = ?
                where email = ?;
                `;

  const row = await connection.query(query, [hashedPassword, salt, email]);

  return row[0].info;
}

// 유저 고유 아이디 조회
async function selectUserId(connection, email) {
  const query = `
                select id
                from User
                where email = ?;
                `;

  const row = await connection.query(query, email);

  return row[0][0]["id"];
}

module.exports = {
  checkEmailExist,
  checkPhoneNumExist,
  createUser,
  getSalt,
  checkPassword,
  checkUserExist,
  selectHomeByUserId,
  selectHomebyAddress,
  selectEventList,
  checkEventExist,
  selectEvent,
  checkFranchiseExist,
  eventToStore,
  selectNoticeList,
  checkNoticeExist,
  selectNotice,
  checkUserBlocked,
  checkUserWithdrawn,
  checkMatchUserWithPhoneNum,
  updateAuthNumByPhoneNum,
  checkAuthNumByPhoneNum,
  selectEmail,
  checkEmailBlocked,
  checkEmailWithdrawn,
  checkMatchUserWithEmail,
  selectPhoneNum,
  updateAuthNumByEmail,
  checkAuthNumByEmail,
  updatePassword,
  selectUserId,
};
