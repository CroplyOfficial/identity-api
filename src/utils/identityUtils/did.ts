import {
  publish,
  Document,
  KeyType,
  KeyPair,
  VerificationMethod,
  Service,
} from "@iota/identity-wasm/node";
import { Ed25519Seed, Bip39 } from "@iota/iota.js";
import bs58 from "bs58";

/**
 * Create a regular normie DID that can be used by normal
 * users to do normal DID stuff
 *
 * @param {Object} clientConfig
 */

const createIdentity = async (clientConfig: Object = {}) => {
  const mnemonic = Bip39.randomMnemonic();

  const baseSeed = Ed25519Seed.fromMnemonic(mnemonic);
  const baseKeypair = baseSeed.keyPair();

  // encode the bytes into base58
  const pubKey = bs58.encode(baseKeypair.publicKey);
  const privKey = bs58.encode(baseKeypair.privateKey);

  // create a new instance of KeyPair using the keypair
  const key = KeyPair.fromBase58(KeyType.Ed25519, pubKey, privKey);
  const doc = Document.fromKeyPair(key);

  doc.sign(key);
  const receipt = await publish(doc.toJSON(), clientConfig);

  return {
    mnemonic,
    doc,
    key,
    receipt,
  };
};

/**
 * Create an identity that is capable of issueing credentials
 * mainly would be useful for the organisation's identity
 *
 * @param {Object} clientConfig
 */

const createIssuerIdentity = async (
  serviceURL: string,
  clientConfig: Object = {}
) => {
  const { doc, mnemonic, key, receipt } = await createIdentity();
  const signing = new KeyPair(KeyType.Ed25519);

  const method = VerificationMethod.fromDID(doc.id, signing, "signing");
  doc.insertMethod(method, "VerificationMethod");

  // Add a new ServiceEndpoint
  const serviceJSON = {
    id: doc.id + "#linked-domain",
    type: "LinkedDomains",
    serviceEndpoint: serviceURL,
  };
  doc.insertService(Service.fromJSON(serviceJSON));

  doc.previousMessageId = receipt;
  doc.sign(key);

  const updatedReceipt = await publish(doc.toJSON(), clientConfig);

  return {
    doc,
    key,
    signing,
    mnemonic,
    receipt,
    updatedReceipt,
  };
};

export { createIssuerIdentity, createIdentity };
