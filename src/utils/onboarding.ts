import { getConfig, writeConfig } from "./configUtil";
import { createIssuerIdentity } from "./did";
import { createEncryptedVault } from "./stronghold";

const startOnboarding = async (owner: string, password: string) => {
  try {
    const { owner } = await getConfig();
    if (owner) return null;
  } catch (error) {
    const { key, doc, receipt, updatedReceipt, mnemonic, signing } =
      await createIssuerIdentity();
    await createEncryptedVault(
      { didKeys: key.toJSON(), signing: signing.toJSON() },
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
