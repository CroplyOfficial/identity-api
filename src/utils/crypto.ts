import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const iv = crypto.randomBytes(16);

const encrypt = (text: string, encryptionSecret: string) => {
  const cipher = crypto.createCipheriv(algorithm, encryptionSecret, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

const decrypt = (hash: any, encryptionSecret: string) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionSecret,
    Buffer.from(hash.iv, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

const encryptJSON = (json: any, encryptionSecret: string) => {
  let encryptedData: any = new Object();
  for (let key in json) {
    if (key != 'ID') {
      encryptedData[key] = encrypt(json[key], encryptionSecret);
    } else {
      encryptedData[key] = json[key];
    }
  }
  return encryptedData;
};

const decryptJSON = (json: any, encryptionSecret: string) => {
  let decryptedData: any = new Object();
  for (let key in json) {
    if (key != 'ID') {
      decryptedData[key] = decrypt(json[key], encryptionSecret);
    } else {
      decryptedData[key] = json[key];
    }
  }
  return decryptedData;
};

module.exports = { encryptJSON, decryptJSON, encrypt, decrypt };
