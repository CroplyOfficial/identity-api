import { getConfig, writeConfig } from "./configUtil";
import { createIdentity } from "./did";
import { createEncryptedVault } from "./stronghold";

const startOnboarding = async (owner: string) => {
  const { key, doc } = await createIdentity();
  await createEncryptedVault(key, "master", "password");
  await writeConfig({
    owner,
    did: doc,
  });
  return await getConfig();
};

export { startOnboarding };
