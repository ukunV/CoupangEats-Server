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

  const lat = response.data.documents[0].address.x;
  const lng = response.data.documents[0].address.y;

  return { lat, lng };
};

const getQueryAddressInfo = async (address) => {
  const response = await axios({
    method: "GET",
    url: `https://dapi.kakao.com/v2/local/search/address.json?analyze_type=similar&query=${address}`,
    headers: {
      Authorization: `KakaoAK ${sercetKey}`,
    },
  });

  const lat = response.data.documents[0].address.x;
  const lng = response.data.documents[0].address.y;

  return { lat, lng };
};

module.exports = {
  getAddressInfo,
  getQueryAddressInfo,
};
