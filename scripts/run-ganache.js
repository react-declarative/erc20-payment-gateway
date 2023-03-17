const ganache = require("ganache-cli");

const rimraf = require("rimraf");
const glob = require("glob");
const path = require("path");

const config = require('../config.json');

glob.sync(path.join(config.db_path, "*"))
  .filter((file) => file !== path.join(config.db_path, ".gitkeep"))
  .forEach((file) => rimraf.sync(file));

const PORT = config.port;

const options = {
  accounts: config.accounts,
  network_id: config.network_id,
  db_path: config.db_path,
};

const server = ganache.server(options);

server.listen(PORT, async err => {
  if (err) {
    throw err;
  }
  console.log(`ganache listening on port ${PORT}...`);
});
