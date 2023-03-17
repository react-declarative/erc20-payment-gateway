const config = require('../../config.json');

module.exports = {
  contracts_build_directory: "../../temp/contracts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: config.port,
      network_id: config.network_id,
      from: config.accounts[0].address,
    },
  },
  compilers: {
    solc: {
      version: "0.8.7",
    }
  },
};
