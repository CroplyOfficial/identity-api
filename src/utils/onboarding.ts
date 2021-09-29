import { getConfig, writeConfig } from "./configUtil";
import { createIssuerIdentity } from "./did";
import { createEncryptedVault } from "./stronghold";
import crypto from "crypto";

const startOnboarding = async (owner: string, password: string) => {
  try {
    const { owner } = await getConfig();
    if (owner) return null;
  } catch (error) {
    const { key, doc, receipt, updatedReceipt, mnemonic, signing } =
      await createIssuerIdentity();
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 1024,
    });

    const priv = privateKey.export({ type: "pkcs1", format: "pem" });
    const pub = publicKey.export({ type: "pkcs1", format: "pem" });

    await createEncryptedVault(
      {
        didKeys: key.toJSON(),
        signing: signing.toJSON(),
        DVIDPair: {
          public: pub,
          secret: priv,
        },
      },
      "master-config",
      password
    );
    await writeConfig({
      owner,
      did: doc.toJSON(),
      receipt,
      updatedReceipt,
    });
    const config = await getConfig();
    return {
      mnemonic,
      ...config,
    };
  }
};

export { startOnboarding };
