const path = require("path");

const readFile = require("../utils/readFile");
const writeFile = require("../utils/writeFile");

const ContractInstance = artifacts.require("PaymentGatewayContract");
const Erc20Instance = artifacts.require("TestERC20");

const CONFIG_PATH = "../../client/src/contract/instances.deployed.json";

module.exports = async (deployer) => {
  const fullPath = path.resolve(__dirname, CONFIG_PATH);
  await deployer.deploy(ContractInstance, Erc20Instance.address);
  const currentConfig = await readFile(fullPath);
  currentConfig["gateway"] = ContractInstance.address;
  await writeFile(fullPath, currentConfig);
};
