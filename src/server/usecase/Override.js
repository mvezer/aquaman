const moment = require('moment');
const config = require('../infrastructure/ConfigStore');

class Override {
  constructor(id, callback) {
    if (!Object.prototype.hasOwnProperty.call(config.get('OVERRIDES'), id)) {
      throw new Error(`Override id has no config: ${id}`);
    }

    this.overrideConfig = config.get('OVERRIDES')[id];
    this.id = id;
    this.callback = callback;
    this.isActive = false;
    this.timeoutObj = null;
    this.startTime = null;
  }

  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    if (this.isActive) {
      return;
    }
    this.startTime = moment().unix();
    this.timeoutObj = setTimeout(this.stop.bind(this), this.overrideConfig.timeout * 1000);
    this.isActive = true;
    this.callback(this.isActive, this.overrideConfig.channels);
    console.log(`Override (${this.id}) has been ACTIVATED`);
  }

  stop() {
    if (!this.isActive) {
      return;
    }
    clearTimeout(this.timeoutObj);
    this.timeoutObj = null;
    this.isActive = false;
    this.callback(this.isActive, this.overrideConfig.channels);
    console.log(`Override (${this.id}) has been STOPPED`);
  }

  getStatus() {
    return {
      id: this.id,
      active: this.isActive,
      timeLeft: this.isActive ? this.overrideConfig.timeout - (moment().unix() - this.startTime) : -1,
    };
  }
}

module.exports = Override;
