module.exports = {
  // Success
  SUCCESS: { isSuccess: true, code: 1000, message: "성공" },

  // Common
  TOKEN_EMPTY: {
    isSuccess: false,
    code: 2000,
    message: "JWT 토큰을 입력해주세요.",
  },
  TOKEN_VERIFICATION_FAILURE: {
    isSuccess: false,
    code: 3000,
    message: "JWT 토큰 검증 실패",
  },
  TOKEN_VERIFICATION_SUCCESS: {
    isSuccess: true,
    code: 1001,
    message: "JWT 토큰 검증 성공",
  }, // ?

  //Request error
  SIGNUP_EMAIL_EMPTY: {
    isSuccess: false,
    code: 2001,
    message: "이메일을 입력해주세요",
  },
  SIGNUP_EMAIL_LENGTH: {
    isSuccess: false,
    code: 2002,
    message: "이메일은 30자리 미만으로 입력해주세요.",
  },
  SIGNUP_EMAIL_TYPE: {
    isSuccess: false,
    code: 2003,
    message: "이메일 형식이 올바르지 않습니다.",
  },
  SIGNUP_PASSWORD_EMPTY: {
    isSuccess: false,
    code: 2004,
    message: "비밀번호를 입력해주세요.",
  },
  SIGNUP_PASSWORD_LENGTH: {
    isSuccess: false,
    code: 2005,
    message: "비밀번호는 8~20자리를 입력해주세요.",
  },
  SIGNUP_NAME_EMPTY: {
    isSuccess: false,
    code: 2006,
    message: "이름을 입력해주세요.",
  },
  SIGNUP_NAME_LENGTH: {
    isSuccess: false,
    code: 2007,
    message: "이름은 최대 10자리입니다.",
  },
  SIGNUP_PHONENUM_EMPTY: {
    isSuccess: false,
    code: 2008,
    message: "전화번호를 입력해주세요.",
  },
  SIGNUP_PHONENUM_TYPE: {
    isSuccess: false,
    code: 2009,
    message: "전화번호의 형식이 올바르지 않습니다.",
  },
  USER_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2010,
    message: "userId값을 입력해주세요.",
  },
  // USER_ID_NOT_MATCH: {
  //   isSuccess: false,
  //   code: 2012,
  //   message: "userId가 적절하지 않습니다.",
  // },
  LATITUDE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2013,
    message: "유효하지 않은 위도입니다.",
  },
  LONGTITUDE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2014,
    message: "유효하지 않은 경도입니다.",
  },
  ADDRESS_IS_EMPTY: {
    isSuccess: false,
    code: 2015,
    message: "주소를 입력해주세요.",
  },
  // CATEGORY_ID_NOT_VALID: {
  //   isSuccess: false,
  //   code: 2016,
  //   message: "유효하지 않은 카테고리 아이디입니다.",
  // },
  PAGE_IS_EMPTY: {
    isSuccess: false,
    code: 2017,
    message: "page를 입력해주세요.",
  },
  PAGE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2018,
    message: "page 형식이 올바르지 않습니다.",
  },
  SIZE_IS_EMPTY: {
    isSuccess: false,
    code: 2019,
    message: "size를 입력해주세요.",
  },
  SIZE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2020,
    message: "size 형식이 올바르지 않습니다.",
  },
  TYPE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2021,
    message: "type 형식이 올바르지 않습니다.",
  },
  ADDRESS_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2022,
    message: "addressId 값을 입력해주세요.",
  },
  AMOUNT_IS_EMPTY: {
    isSuccess: false,
    code: 2023,
    message: "수량을 입력해주세요.",
  },
  AMOUNT_IS_NOT_VALID: {
    isSuccess: false,
    code: 2024,
    message: "수량이 올바르지 않습니다.",
  },
  PRICE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2025,
    message: "주문금액이 올바르지 않습니다.",
  },
  STORE_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2026,
    message: "storeId 값을 입력해주세요.",
  },
  TOTAL_PRICE_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2027,
    message: "totalPrice 값을 입력해주세요.",
  },
  FILTER_IS_NOT_VALID: {
    isSuccess: false,
    code: 2028,
    message: "filter 값이 올바르지 않습니다.",
  },
  COUPON_STATUS_IS_NOT_VALID: {
    isSuccess: false,
    code: 2029,
    message: "coupon 값이 올바르지 않습니다.",
  },
  EVENT_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2030,
    message: "eventId 값을 입력해주세요.",
  },
  DISTANCE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2031,
    message: "distance 값이 올바르지 않습니다.",
  },
  NOTICE_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2032,
    message: "noticeId 값을 입력해주세요.",
  },
  MENU_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2033,
    message: "menuId 값을 입력해주세요.",
  },
  CATEGORY_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2034,
    message: "categoryId 값을 입력해주세요.",
  },
  FRANCHISE_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2035,
    message: "franchiseId 값을 입력해주세요.",
  },
  PHOTO_FILTER_IS_NOT_VALID: {
    isSuccess: false,
    code: 2036,
    message: "photoFilter 값이 올바르지 않습니다.",
  },
  POINT_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2037,
    message: "point 값을 입력해주세요.",
  },
  POINT_IS_NOT_VALID: {
    isSuccess: false,
    code: 2038,
    message: "point 값이 올바르지 않습니다.",
  },
  POINT_IS_EMPTY: {
    isSuccess: false,
    code: 2039,
    message: "point 값을 입력해주세요.",
  },
  ORDER_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2040,
    message: "orderId 값을 입력해주세요.",
  },
  CONTENTS_IS_SHORT: {
    isSuccess: false,
    code: 2041,
    message: "리뷰는 10자 이상 작성해주세요.",
  },
  REVIEW_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2042,
    message: "reviewId 값을 입력해주세요.",
  },
  CHOOSE_MORE_THAN_ONE_SELECT_REASON: {
    isSuccess: false,
    code: 2043,
    message: "선택사유를 선택해주세요.",
  },
  COMMENT_REASON_IS_SHORT: {
    isSuccess: false,
    code: 2044,
    message: "기재사유는 10자 이상 작성해주세요.",
  },
  SELECT_REASON_TYPE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2045,
    message: "선택사유의 값이 유효하지 않습니다.",
  },
  PAYMENT_TYPE_IS_EMPTY: {
    isSuccess: false,
    code: 2046,
    message: "등록할 결제방식을 선택해주세요.",
  },
  CARD_NUM_IS_NOT_VALID: {
    isSuccess: false,
    code: 2047,
    message: "카드번호가 올바르지 않습니다.",
  },
  VALID_MONTH_IS_NOT_VALID: {
    isSuccess: false,
    code: 2048,
    message: "올바른 유효기간(월)을 입력해주세요.",
  },
  VALID_YEAR_IS_NOT_VALID: {
    isSuccess: false,
    code: 2049,
    message: "올바른 유효기간(년)을 입력해주세요.",
  },
  CARD_IS_EXPIRED: {
    isSuccess: false,
    code: 2050,
    message: "카드의 유효기간이 만료되었습니다.",
  },
  CARD_NUM_IS_EMPTY: {
    isSuccess: false,
    code: 2051,
    message: "카드번호를 입력해주세요.",
  },
  VALID_MONTH_IS_EMPTY: {
    isSuccess: false,
    code: 2052,
    message: "유효기간(월)을 입력해주세요.",
  },
  VALID_YEAR_IS_EMPTY: {
    isSuccess: false,
    code: 2053,
    message: "유효기간(년)을 입력해주세요.",
  },
  CVC_NUM_IS_EMPTY: {
    isSuccess: false,
    code: 2054,
    message: "cvc번호를 입력해주세요.",
  },
  CARD_PWD_IS_EMPTY: {
    isSuccess: false,
    code: 2055,
    message: "카드 비밀번호 앞 두자리를 입력해주세요.",
  },
  CVC_NUM_LENGTH_ERROR: {
    isSuccess: false,
    code: 2056,
    message: "cvc번호는 3자리입니다.",
  },
  CARD_PWD_LENGTH_ERROR: {
    isSuccess: false,
    code: 2057,
    message: "카드 비밀번호는 2자리입니다.",
  },
  TYPE_IS_NOT_FOR_CARD: {
    isSuccess: false,
    code: 2058,
    message: "카드등록을 위한 올바른 type을 입력해주세요.",
  },
  TYPE_IS_NOT_FOR_ACCOUNT: {
    isSuccess: false,
    code: 2059,
    message: "계좌등록을 위한 올바른 type을 입력해주세요.",
  },
  BANK_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2060,
    message: "bankId를 입력해주세요.",
  },
  ACCOUNT_NUM_IS_EMPTY: {
    isSuccess: false,
    code: 2061,
    message: "계좌번호를 입력해주세요.",
  },
  PAYMENT_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2062,
    message: "paymentId 값을 입력해주세요.",
  },
  IS_GET_IS_EMPTY: {
    isSuccess: false,
    code: 2063,
    message: "현금영수증 발급 여부를 선택해주세요.",
  },
  IS_GET_IS_NOT_VALID: {
    isSuccess: false,
    code: 2064,
    message: "현금영수증 발급 여부가 올바르지 않습니다.",
  },
  CASH_RECEIPT_METHOD_IS_EMPTY: {
    isSuccess: false,
    code: 2065,
    message: "현금영수증 발급 방식을 선택해주세요.",
  },
  CASH_RECEIPT_METHOD_IS_NOT_VALID: {
    isSuccess: false,
    code: 2066,
    message: "현금영수증 발급 방식이 올바르지 않습니다.",
  },
  CASH_RECEIPT_NUM_IS_EMPTY: {
    isSuccess: false,
    code: 2067,
    message: "현금영수증 발급 번호를 입력해주세요.",
  },
  ROOT_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2068,
    message: "메뉴의 부모 아이디(rootId)를 입력해주세요.",
  },
  TOTAL_PRICE_IS_EMPTY: {
    isSuccess: false,
    code: 2069,
    message: "주문가격을 입력해주세요.",
  },
  TOTAL_PRICE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2070,
    message: "주문가격이 올바르지 않습니다.",
  },
  COUPON_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2071,
    message: "couponId를 입력해주세요.",
  },
  DELIVERY_FEE_PRICE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2072,
    message: "배달비가 올바르지 않습니다.",
  },
  DISCOUNT_PRICE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2073,
    message: "할인금액이 올바르지 않습니다.",
  },
  FINAL_PRICE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2074,
    message: "최종 결제금액이 올바르지 않습니다.",
  },
  COUPON_OBTAINED_ID_IS_EMPTY: {
    isSuccess: false,
    code: 2075,
    message: "couponObtainedId 값을 입력해주세요.",
  },
  LOCATION_INFO_IS_NOT_VALID: {
    isSuccess: false,
    code: 2076,
    message: "위치정보가 잘못되었습니다.",
  },
  ORDER_STATUS_IS_EMPTY: {
    isSuccess: false,
    code: 2077,
    message: "변경을 원하는 주문상태를 입력해주세요.",
  },
  ORDER_STATUS_IS_NOT_VALID: {
    isSuccess: false,
    code: 2078,
    message: "주문상태가 올바르지 않습니다.",
  },
  AUTH_TYPE_IS_EMPTY: {
    isSuccess: false,
    code: 2079,
    message: "인증방식을 선택해주세요.",
  },
  AUTH_TYPE_IS_NOT_VALID: {
    isSuccess: false,
    code: 2080,
    message: "올바른 인증방식을 선택해주세요.",
  },
  AUTH_NUM_IS_EMPTY: {
    isSuccess: false,
    code: 2081,
    message: "인증번호 입력해주세요.",
  },
  CHECK_PASSWORD_IS_EMPTY: {
    isSuccess: false,
    code: 2082,
    message: "확인 비밀번호를 입력해주세요.",
  },
  PASSWORD_IS_DIFFERENT: {
    isSuccess: false,
    code: 2083,
    message: "비밀번호가 일치하지 않습니다.",
  },
  ACCESS_TOKEN_IS_EMPTY: {
    isSuccess: false,
    code: 2084,
    message: "accessToken 값을 입력해주세요.",
  },
  ACCESS_TOKEN_IS_NOT_VALID: {
    isSuccess: false,
    code: 2085,
    message: "유효하지 않는 Access Token 입니다.",
  },

  // Response error
  SIGNUP_REDUNDANT_EMAIL: {
    isSuccess: false,
    code: 3001,
    message: "중복된 이메일입니다.",
  },
  SIGNUP_REDUNDANT_PHONENUM: {
    isSuccess: false,
    code: 3002,
    message: "중복된 전화번호입니다.",
  },
  SIGNIN_EMAIL_NOT_EXIST: {
    isSuccess: false,
    code: 3003,
    message: "존재하지 않는 이메일입니다.",
  },
  SIGNIN_PASSWORD_WRONG: {
    isSuccess: false,
    code: 3004,
    message: "비밀번호가 올바르지 않습니다.",
  },
  CATEGORY_NOT_EXIST: {
    isSuccess: false,
    code: 3005,
    message: "존재하지 않는 카테고리입니다.",
  },
  USER_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3006, // 2011
    message: "해당 유저는 존재하지 않습니다.",
  },
  ADDRESS_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3007, // 2016
    message: "존재하지 않는 주소입니다.",
  },
  STORE_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3008,
    message: "존재하지 않는 음식점입니다.",
  },
  // ADDRESS_IS_DELETED: {
  //   isSuccess: false,
  //   code: 3009,
  //   message: "삭제된 주소입니다.",
  // },
  // STORE_IS_DELETED: {
  //   isSuccess: false,
  //   code: 3010,
  //   message: "삭제된 음식점입니다.",
  // },
  MENU_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3011,
    message: "존재하지 않는 메뉴입니다.",
  },
  // MENU_IS_DELETED: {
  //   isSuccess: false,
  //   code: 3012,
  //   message: "삭제된 메뉴입니다.",
  // },
  CART_IS_EMPTY: {
    isSuccess: false,
    code: 3013,
    message: "카트가 비어 있습니다.",
  },
  SAME_STORE_MENU: {
    isSuccess: false,
    code: 3014,
    message: "같은 음식점의 상품입니다.",
  },
  COUPON_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3015,
    message: "존재하지 않는 쿠폰입니다.",
  },
  COUPON_IS_NOT_VALID: {
    isSuccess: false,
    code: 3016,
    message: "유효기간이 지난 쿠폰입니다.",
  },
  COUPON_AlREADY_OBTAINED: {
    isSuccess: false,
    code: 3017,
    message: "해당 쿠폰은 이미 발급되었습니다.",
  },
  STORE_LIKE_ALREADY_EXIST: {
    isSuccess: false,
    code: 3018,
    message: "해당 음식점은 이미 즐겨찾기에 있습니다.",
  },
  STORE_LIKE_NOT_EXIST: {
    isSuccess: false,
    code: 3019,
    message: "즐겨찾기에 등록되지 않은 음식점입니다.",
  },
  SUB_MENU_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3020,
    message: "존재하지 않는 추가메뉴입니다.",
  },
  SUB_MENU_IS_DELETED: {
    isSuccess: false,
    code: 3021,
    message: "삭제된 추가메뉴입니다.",
  },
  EVENT_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3022,
    message: "존재하지 않는 이벤트입니다.",
  },
  EVENT_IS_DELETED: {
    isSuccess: false,
    code: 3023,
    message: "삭제된 이벤트입니다.",
  },
  FRANCHISE_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3024,
    message: "존재하지 않는 프랜차이즈입니다.",
  },
  NOTICE_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3025,
    message: "존재하지 않는 공지입니다.",
  },
  // NOTICE_IS_DELETED: {
  //   isSuccess: false,
  //   code: 3026,
  //   message: "삭제된 공지입니다.",
  // },
  ORDER_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3027,
    message: "주문내역이 존재하지 않습니다.",
  },
  ORDER_IS_DELETED: {
    isSuccess: false,
    code: 3028,
    message: "결제취소된 주문입니다.",
  },
  REVIEW_ALREADY_EXIST: {
    isSuccess: false,
    code: 3029,
    message: "해당 주문의 리뷰는 이미 존재합니다.",
  },
  ORDER_IS_NOT_USERS: {
    isSuccess: false,
    code: 3030,
    message: "해당 주문은 다른 유저의 주문입니다.",
  },
  REVIEW_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3031,
    message: "존재하지 않는 리뷰입니다.",
  },
  USER_IS_NOT_REVIEW_HOST: {
    isSuccess: false,
    code: 3032,
    message: "리뷰 수정/삭제는 작성자만 가능합니다.",
  },
  REVIEW_CAN_REPORTED_BY_OTHERS: {
    isSuccess: false,
    code: 3033,
    message: "자신의 리뷰는 신고가 불가능합니다.",
  },
  USER_ALREADY_REPORT: {
    isSuccess: false,
    code: 3034,
    message: "해당 리뷰는 이미 신고가 완료되었습니다.",
  },
  BANK_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3035,
    message: "해당 은행은 존재하지 않습니다.",
  },
  NUMBER_LENGTH_IS_NOT_VALID: {
    isSuccess: false,
    code: 3036,
    message: "계좌번호의 길이가 올바르지 않습니다.",
  },
  PAYMENT_IS_NOT_EXIST: {
    isSuccess: false,
    code: 3037,
    message: "등록되지 않은 결제수단입니다.",
  },
  PAYMENT_IS_NOT_USERS: {
    isSuccess: false,
    code: 3038,
    message: "해당 결제방식은 다른 유저의 결제방식입니다.",
  },
  OTHER_STORE_EXIST: {
    isSuccess: false,
    code: 3039,
    message: "이미 다른 상점의 메뉴가 카트에 존재합니다.",
  },
  MENU_IS_NOT_EXIST_AT_CART: {
    isSuccess: false,
    code: 3040,
    message: "해당 메뉴는 카트에 존재하지 않습니다.",
  },
  COUPON_NOT_OBTAIN: {
    isSuccess: false,
    code: 3041,
    message: "획득하지 못한 쿠폰입니다.",
  },
  ORDER_IS_FINISHED: {
    isSuccess: false,
    code: 3042,
    message: "해당 주문은 취소 혹은 배달완료된 주문건입니다.",
  },
  ORDER_IS_NOT_WAIT_STATUS: {
    isSuccess: false,
    code: 3043,
    message: "해당 주문은 주문 대기 상태가 아닙니다.",
  },
  ORDER_IS_NOT_ACCEPT_STATUS: {
    isSuccess: false,
    code: 3044,
    message: "해당 주문은 주문 수락 상태가 아닙니다.",
  },
  ORDER_IS_NOT_PREPARE_STATUS: {
    isSuccess: false,
    code: 3045,
    message: "해당 주문은 메뉴 준비중 상태가 아닙니다.",
  },
  ORDER_IS_NOT_DELIVERY_STATUS: {
    isSuccess: false,
    code: 3046,
    message: "해당 주문은 배달중 상태가 아닙니다.",
  },
  AUTH_NUM_IS_NOT_MATCH: {
    isSuccess: false,
    code: 3047,
    message: "인증번호가 일치하지 않습니다.",
  },

  //////////////////////////////////////////

  ACCOUNT_IS_BLOCKED: {
    isSuccess: false,
    code: 3998,
    message: "정지된 계정입니다. 고객센터에 문의해주세요.",
  },
  ACCOUNT_IS_WITHDRAWN: {
    isSuccess: false,
    code: 3999,
    message: "탈퇴된 계정입니다. 고객센터에 문의해주세요.",
  },

  //Connection, Transaction 등의 서버 오류
  DB_ERROR: { isSuccess: false, code: 4000, message: "데이터 베이스 에러" },
  SERVER_ERROR: { isSuccess: false, code: 4001, message: "서버 에러" },
};
