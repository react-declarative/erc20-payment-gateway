const fs = require("fs").promises;

async function writeFile(path, obj) {
    const json = JSON.stringify(obj, null, 2);
    await fs.writeFile(path, json);
}

module.exports = writeFile;
