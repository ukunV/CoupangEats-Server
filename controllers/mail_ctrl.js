const nodemailer = require("nodemailer");
const mailConf = require("../config/mail_config");

const sendMail = async (mail) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: mailConf.user,
        pass: mailConf.pass,
      },
    });

    await transporter.sendMail({
      ...mail,
    });
  } catch (err) {
    console.error(`Mail Error: ${err}`);
  }
};

const resetPasswordMail = async (authNum, to) => {
  const mail = {
    from: "CoupangEats",
    to: to,
    subject: `[쿠팡이츠] 비밀번호 재설정 인증번호 안내 메일입니다.`,
    text: `비밀번호 재설정 인증번호를 확인하세요.`,
    html: `<div style="color: black"><ul style="font-size: 16px; background: #eee; border-radius: 10px; padding: 15px; list-style: none">
        <li>인증번호: ${authNum}</li>
        <li>* 인증번호 입력 후 비밀번호를 재설정하세요.</li>
    </ul>
    <p style="margin-top: 35px; text-align: center; font-size: 18px">쿠팡이츠</p>
    <p style="margin-top: 15px; text-align: center; font-size: 12px; color: '#999'">
        본 메일은 발신 전용입니다.
    </p></div>`,
  };
  return await sendMail(mail);
};

module.exports = { resetPasswordMail };
