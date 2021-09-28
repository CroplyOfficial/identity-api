import { getConfig } from "./configUtil";
import {
  VerifiableCredential,
  Document,
  KeyPair,
  checkCredential,
} from "@iota/identity-wasm/node";
import { createIdentity } from "./did";
import { readDataFromVault } from "./stronghold";
import dns from "dns/promises";
import crypto from "crypto";
import bs58 from "bs58";
import { minifyRSA, convertToPEM } from "./crypto";

/**
 * Create a new verifiable credential that can be issued
 * using the issuer's DID to the DID that is provided in
 * the params of this function
 *
 * @param {Domain}
 * @param {DID} did of the the user to issue the cred
 * @param {credentialSubject} data for the credential
 * @returns VerifiableCredential
 */

const createVerifiableCredential = async (
  domain: string,
  recipient: string,
  credentialSubject: Object
) => {
  const { did } = await getConfig();

  credentialSubject = { id: recipient, ...credentialSubject };

  const dataBuffer = Buffer.from(JSON.stringify(credentialSubject));

  const keys = await readDataFromVault("master-config", "password");
  const issuer = Document.fromJSON(did);

  const signingPair = JSON.parse(keys).DVIDPair;
  const priv = crypto.createPrivateKey(signingPair.secret);
  const pub = crypto.createPublicKey(signingPair.public);

  const signBuffer = crypto.sign("SHA256", dataBuffer, priv);

  credentialSubject = { ...credentialSubject, sign: bs58.encode(signBuffer) };

  const unsignedVC = VerifiableCredential.extend({
    id: `${domain}/verify/vc${recipient}`,
    type: "VerifiableLolCredential",
    issuer: issuer.id.toString(),
    credentialSubject,
  });

  const keyPair = KeyPair.fromJSON(JSON.parse(keys).signing);

  const signedVC = issuer.signCredential(unsignedVC, {
    method: issuer.id.toString() + "#signing",
    public: keyPair.public,
    secret: keyPair.secret,
  });

  return signedVC;
};

/**
 * Verify the VerifiableCredential against both the tangle
 * and by validating the signature on the VC against the
 * public key available in the tangle
 *
 * @param VerifiableCredential
 * @returns {IVerifiableCredentialCheck}
 */

interface IVerifiableCredentialCheck {
  DVID: boolean;
  Tangle: boolean;
}
const verifyCredential = async (
  credential: any
): Promise<IVerifiableCredentialCheck> => {
  const keys = await readDataFromVault("master-config", "password");
  const DVIDPair = JSON.parse(keys).DVIDPair;
  const rootDomain = String(JSON.parse(credential).id)
    .split("//")[1]
    .split("/")[0];

  const records = await dns.resolveTxt(rootDomain);
  const DVIDKeyRecord = records.find((record) =>
    record[0].includes("DVID.publicKey")
  );
  if (!DVIDKeyRecord) throw new Error("DVID Failed, no record found");
  const DVIDKey = String(DVIDKeyRecord[0].split("DVID.publicKey=")[1]).trim();

  const pem = convertToPEM(DVIDKey);
  const pub = crypto.createPublicKey(pem);

  let data = JSON.parse(credential).credentialSubject;
  const sign = bs58.decode(data.sign);
  delete data.sign;
  const isDomainVerfied = crypto.verify(
    "SHA256",
    Buffer.from(JSON.stringify(data)),
    pub,
    sign
  );

  const isTangleVerified = await checkCredential(credential.toString(), {});

  return {
    DVID: isDomainVerfied,
    Tangle: isTangleVerified.verified,
  };
};

/**
 * dear traveller, 'tis but a test do not use it for something
 */

const test = async () => {
  console.log("creating vc...");
  const vc = await createVerifiableCredential(
    "http://coodos.co",
    "did:iota:3Tmo5Rn5hEbpquRk1NQjiuDEANqESfm5Xm1EryDSa7Dd",
    {
      name: "lol",
    }
  );
  console.log("verifying...");
  const result = await verifyCredential(vc);
  console.log(result);
};

export { createVerifiableCredential };
