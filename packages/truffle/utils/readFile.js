const fs = require("fs").promises;

async function readFile(path) {
    const buffer = await fs.readFile(path);
    return JSON.parse(buffer.toString());
}

module.exports = readFile;
