import {
  publish,
  Document,
  KeyType,
  KeyPair,
} from "@iota/identity-wasm/node/identity_wasm.js";
import { Ed25519Seed, Bip39, Converter, Ed25519 } from "@iota/iota.js";
import { createEncryptedVault } from "./stronghold";
import bs58 from "bs58";

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

  const receipt = await publish(doc.toJSON(), clientConfig);

  return {
    doc,
    key,
    mnemonic,
    receipt,
  };
};

export { createIdentity };
