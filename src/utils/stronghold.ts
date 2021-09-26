import { promisify } from "util";
import proc from "child_process";
import path from "path";
const exec = promisify(proc.exec);

/**
 * Creates a new secured stronghold wallet using the
 * submodule of stronghold.rs that has been installed
 *
 * @param {Object} data - data that needs to be encrypted
 *                 stronghold unto intself allows strings
 *                 but this funciton requires an Object
 * @param {String} password - the password to set for the
 *                 stronghold file
 * @param {String} record - record is basically the unique
 *                 identifier for the vault
 */

const createEncryptedVault = async (
  data: Object,
  password: string,
  record: string
) => {
  const { stdout } = await exec(
    `cargo run --example cli write --plain '${JSON.stringify(
      data
    )}' --record-path "${record}" --pass "${password}"`,
    { cwd: path.resolve(__dirname + "../../../stronghold.rs/") }
  );
  if (stdout && stdout.trim() === "Ok(())") {
    return "woop";
  } else {
    throw new Error("unable to create vault :(");
  }
};

/**
 * Read data from a stronghold file and then it in form of
 * a JSON
 *
 * @param {String} record - identifier for the encrypted
 *                 stronghold vault
 * @param {String} password - password for the encrypted
 *                 stronghold vault
 */

const readDataFromVault = async (record: string, password: string) => {
  const { stdout } = await exec(
    `cargo run --example cli read --record-path "${record}" --pass "${password}"`,
    { cwd: path.resolve(__dirname + "../../../stronghold.rs/") }
  );
  const raw_data = stdout.split("Data: ")[1];
  const data = JSON.parse(raw_data);
  if (!data) throw new Error("wrong record or password");
  return data;
};

export { createEncryptedVault, readDataFromVault };
