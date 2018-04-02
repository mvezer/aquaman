const JSONstore = require('./JSONstore');

class ConfigStore extends JSONstore {
  get(key) {
    if (Object.prototype.hasOwnProperty.call(process.env, key)) {
      return process.env[key];
    }

    if (super.has(key)) {
      return super.get(key);
    }

    throw new Error(`Cannot find key: "${key}"`);
  }
}

const instance = new ConfigStore('config/config.json');
Object.freeze(instance);

module.exports = instance;
