import { getConfig, writeConfig } from "./configUtil";
import { createIssuerIdentity } from "../identityUtils/did";
import { createEncryptedVault } from "./stronghold";
import { minifyRSA } from "../identityUtils/crypto";
import crypto from "crypto";

const startOnboarding = async (
  owner: string,
  password: string,
  domain: string
) => {
  try {
    const { owner } = await getConfig();
    if (owner) return null;
  } catch (error) {
    const { key, doc, receipt, updatedReceipt, mnemonic, signing } =
      await createIssuerIdentity(domain);
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

    const DVIDKey = minifyRSA(pub as string);
    await writeConfig({
      owner,
      did: doc.toJSON(),
      receipt,
      domain,
      updatedReceipt,
      DVIDKey,
    });
    const config = await getConfig();
    return {
      mnemonic,
      ...config,
    };
  }
};

export { startOnboarding };
