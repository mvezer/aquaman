const gpio = require('mc-gpio');
const config = require('./ConfigStore');

class GPIOservice {
  constructor(pins) {
    this.pins = pins;
  }

  init() {
    return Promise.all(this.pins.map(pin => this.initPin(pin)));
  }

  initPin(pin) {
    return new Promise((resolve, reject) => {
      if (config.get('PROFILE') === 'production') {
        gpio.openPin(pin, 'out', (error) => {
          if (error) {
            reject(error);
          }
          resolve(pin);
        });
      } else {
        console.log(`Pin ${pin}, is inited`);
        resolve(pin);
      }
    });
  }

  set(pin, state) {
    return new Promise((resolve, reject) => {
      if (config.get('PROFILE') === 'production') {
        gpio.write(pin, state ? 0 : 1, (error) => {
          if (error) {
            reject(error);
          }
          resolve({ pin, state });
        });
      } else {
        console.log(`Pin ${pin}, is set to '${state}'`);
        resolve(pin);
      }
    });
  }
}

module.exports = GPIOservice;
