const fs = require('fs');

class JSONstore {
  constructor(fileName) {
    this.fileName = fileName;
    this.data = new Map();
    this.load();
  }

  load() {
    if (fs.existsSync(this.fileName)) {
      this.data = JSON.parse(fs.readFileSync(this.fileName));
    } else {
      this.init();
    }
  }

  init() {
    this.data = {};
    this.save();
  }

  save() {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data));
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this.data, key);
  }

  set(key, value) {
    this.data.set[key] = value;
    this.save();
  }

  get(key) {
    if (this.has(key)) {
      return this.data[key];
    }

    throw new Error(`Cannot find key: "${key}"`);
  }
}

module.exports = JSONstore;
