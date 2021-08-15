const crypto = require("crypto");

const createSalt = async function () {
  const salt = await crypto.randomBytes(64).toString("base64");

  return salt;
};

// const createHashedPassword = async function (password) {
//   const salt = await createSalt();

//   console.log(salt);

//   const hashedPassword = await crypto
//     .pbkdf2(password, salt, 9999, 64, "sha512")
//     .toString("base64");

//   return [salt, hashedPassword];
// };

const createHashedPassword = (plainPassword) =>
  new Promise(async (resolve, reject) => {
    const salt = await createSalt();

    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);

      resolve({ hashedPassword: key.toString("base64"), salt });
    });
  });

const makePasswordHashed = (salt, plainPassword) =>
  new Promise(async (resolve, reject) => {
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);

      resolve(key.toString("base64"));
    });
  });

module.exports = {
  createHashedPassword,
  makePasswordHashed,
};
