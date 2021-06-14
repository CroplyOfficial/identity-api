import {
  Document,
  KeyType,
  publish,
} from '@iota/identity-wasm/node/identity_wasm.js';

const createIdentity = async (clientConfig: Object = {}) => {
  const { doc, key }: any = new Document(KeyType.Ed25519);

  doc.sign(key);

  const messageId = await publish(doc.toJSON(), clientConfig);

  return {
    messageId,
    key,
  };
};

export { createIdentity };
