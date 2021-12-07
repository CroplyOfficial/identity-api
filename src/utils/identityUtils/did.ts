import {
  Document,
  KeyType,
  KeyPair,
  VerificationMethod,
  Service,
  Client,
  Network,
  Timestamp,
  Config,
  KeyCollection,
  Digest,
} from "@iota/identity-wasm/node";
import { Ed25519Seed, Bip39 } from "@iota/iota.js";
import bs58 from "bs58";

const clientConfig = Config.fromNetwork(Network.mainnet());
clientConfig.setPermanode("https://chrysalis-chronicle.iota.org/api/mainnet/");

const client = Client.fromConfig(clientConfig);

/**
 * Create a regular normie DID that can be used by normal
 * users to do normal DID stuff
 *
 * @param {Object} clientConfig
 */

const createIdentity = async () => {
  const mnemonic = Bip39.randomMnemonic();
  const baseSeed = Ed25519Seed.fromMnemonic(mnemonic);
  const baseKeypair = baseSeed.keyPair();

  // encode the bytes into base58
  const pubKey = bs58.encode(baseKeypair.publicKey);
  const privKey = bs58.encode(baseKeypair.privateKey);

  // create a new instance of KeyPair using the keypair
  const key = KeyPair.fromBase58(KeyType.Ed25519, pubKey, privKey);
  const doc = Document.fromKeyPair(key, Network.mainnet().toString());

  doc.sign(key);

  const receipt = await client.publishDocument(doc.toJSON()).catch((error) => {
    throw error;
  });

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

const createIssuerIdentity = async (serviceURL: string) => {
  const { doc, mnemonic, key, receipt } = await createIdentity();
  const signing = new KeyPair(KeyType.Ed25519);

  // create merkle key collection
  const keys = new KeyCollection(KeyType.Ed25519, 512);
  const method = VerificationMethod.createMerkleKey(
    Digest.Sha256,
    doc.id,
    keys,
    "signing-collection"
  );

  doc.insertMethod(method, "VerificationMethod");

  // Add a new ServiceEndpoint
  const serviceJSON = {
    id: doc.id + "#linked-domain",
    type: "LinkedDomains",
    serviceEndpoint: serviceURL,
  };
  doc.insertService(Service.fromJSON(serviceJSON));

  doc.previousMessageId = receipt.messageId;
  doc.updated = Timestamp.nowUTC();

  doc.sign(key);

  const updatedReceipt = await client.publishDocument(doc.toJSON());

  return {
    doc,
    key,
    keys,
    signing,
    mnemonic,
    receipt,
    updatedReceipt,
  };
};

const tests = async () => {
  const issuerDid = await createIssuerIdentity("http://iota.org");
  console.log(issuerDid);
};

if (require.main === module) {
  tests();
}

export { createIssuerIdentity, createIdentity };
