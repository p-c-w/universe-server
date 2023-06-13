const crypto = require('crypto');
const util = require('util');

const randomBytesPromise = util.promisify(crypto.randomBytes);

const createSalt = async () => {
  const buffer = await randomBytesPromise(64);
  return buffer.toString('base64');
};
