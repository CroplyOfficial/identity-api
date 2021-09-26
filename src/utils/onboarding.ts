import { getConfig, writeConfig } from "./configUtil";
import { createIdentity } from "./did";
import { createEncryptedVault } from "./stronghold";

const startOnboarding = async (owner: string, password: string) => {
  const { key, doc, mnemonic } = await createIdentity();
  await createEncryptedVault(key, "master-config", password);
  await writeConfig({
    owner,
    did: doc,
    mnemonic,
  });
  return await getConfig();
};

export { startOnboarding };
