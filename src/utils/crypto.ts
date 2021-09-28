import crypto from "crypto";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

const encryptionSecret: any = process.env.ENC_SECRET;

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, encryptionSecret, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash: any) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    encryptionSecret,
    Buffer.from(hash.iv, "hex")
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(hash.content, "hex")),
    decipher.final(),
  ]);

  return decrpyted.toString();
};

const encryptJSON = (json: any) => {
  let encryptedData: any = new Object();
  for (let key in json) {
    if (key != "ID") {
      encryptedData[key] = encrypt(json[key]);
    } else {
      encryptedData[key] = json[key];
    }
  }
  return encryptedData;
};

const decryptJSON = (json: any) => {
  let decryptedData: any = new Object();
  for (let key in json) {
    if (key != "ID") {
      decryptedData[key] = decrypt(json[key]);
    } else {
      decryptedData[key] = json[key];
    }
  }
  return decryptedData;
};

const minifyRSA = (key: string) => {
  const rawData = key
    .split("-----BEGIN RSA PUBLIC KEY-----\n")[1]
    .split("-----END RSA PUBLIC KEY")[0]
    .split("\n");
  return rawData.join("");
};

const convertToPEM = (minified: string) => {
  const rawData = minified.match(/.{1,64}/g);
  if (!rawData) throw new Error("invalid key");
  const multilineBase64 = rawData.join("\n");
  return (
    "-----BEGIN RSA PUBLIC KEY-----\n" +
    multilineBase64 +
    "\n-----END RSA PUBLIC KEY-----\n"
  );
};

export { encryptJSON, decryptJSON, encrypt, decrypt, minifyRSA, convertToPEM };
