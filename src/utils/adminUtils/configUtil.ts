import fs from "fs/promises";

const getConfig = async () => {
  const fileData = await fs.readFile("config.json", "utf-8");
  return JSON.parse(fileData);
};

interface IConfig {
  owner: string;
  did: any;
  receipt: string;
  updatedReceipt: string;
  DVIDKey: string;
}
const writeConfig = async (config: IConfig) => {
  await fs.writeFile("config.json", JSON.stringify(config), "utf-8");
};

export { writeConfig, getConfig };
