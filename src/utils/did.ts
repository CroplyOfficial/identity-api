import {
  DID,
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
  const pubKey = bs58.encode(
    Buffer.from(Converter.bytesToHex(baseKeypair.privateKey), "hex")
  );
  const privKey = bs58.encode(
    Buffer.from(Converter.bytesToHex(baseKeypair.publicKey), "hex")
  );
  console.log(pubKey);

  const keyPair = KeyPair.fromBase58(KeyType.Ed25519, pubKey, privKey);
  console.log(keyPair);

  const doc = Document.fromKeyPair(keyPair);
  console.log(doc);
};

const test = async () => {
  await createIdentity();
};

test();

export { createIdentity };
