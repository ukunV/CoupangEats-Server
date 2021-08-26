const axios = require("axios");
const sercetKey = require("../config/kakao_config").sercetKey;

const getAddressInfo = async (address) => {
  const encodedAddress = encodeURIComponent(address);

  const response = await axios({
    method: "GET",
    url: `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&query=${encodedAddress}`,
    headers: {
      Authorization: `KakaoAK ${sercetKey}`,
    },
  });

  if (response.data.documents.length === 0) {
    return "위치정보가 잘못되었습니다.";
  }

  const lat = response.data.documents[0].address.x;
  const lng = response.data.documents[0].address.y;

  const result = { lat, lng };

  return result;
};

module.exports = {
  getAddressInfo,
};
