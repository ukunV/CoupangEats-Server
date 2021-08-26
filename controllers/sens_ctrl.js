const axios = require("axios");
const crypto = require("crypto");

class NCPClient {
  constructor(options) {
    const { phoneNumber, serviceId, secretKey, accessKey } = options;
    this.phoneNumber = phoneNumber;
    this.serviceId = serviceId;
    this.secretKey = secretKey;
    this.accessKey = accessKey;
    this.url = `https://sens.apigw.ntruss.com/sms/v2/services/${this.serviceId}/messages`;
    this.method = "POST";
  }

  async sendSMS({ to, content, countryCode = "82" }) {
    try {
      const { timestamp, signature } = this.prepareSignature();

      const response = await axios({
        method: this.method,
        url: this.url,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-ncp-apigw-timestamp": timestamp,
          "x-ncp-iam-access-key": this.accessKey,
          "x-ncp-apigw-signature-v2": signature,
        },
        data: {
          type: "SMS",
          contentType: "COMM",
          countryCode,
          from: this.phoneNumber,
          content,
          messages: [
            {
              to: `${to}`,
            },
          ],
        },
      });

      if (response.status === 202) {
        return {
          success: true,
          status: response.status,
          msg: response.statusText,
        };
      } else {
        return {
          success: false,
          status: response.status,
          msg: response.statusText,
        };
      }
    } catch (error) {
      return {
        success: false,
        msg: error.response.statusText || "Internal Server Error",
        status: error.response.status || 500,
      };
    }
  }

  prepareSignature() {
    const space = " ";
    const newLine = "\n";
    const message = [];
    const hmac = crypto.createHmac("sha256", this.secretKey);
    const url2 = `/sms/v2/services/${this.serviceId}/messages`;
    const timestamp = Date.now().toString();

    message.push(this.method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(this.accessKey);

    const signature = hmac.update(message.join("")).digest("base64");

    return {
      timestamp,
      signature,
    };
  }
}

module.exports = {
  NCPClient,
};
