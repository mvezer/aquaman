const GPIOservice = require('../infrastructure/GPIOservice');
const DailyScheduler = require('../infrastructure/DailyScheduler');
const Override = require('./Override');

class Scheduler {
  constructor(schedules) {
    this.gpioService = new GPIOservice(schedules.map(schedule => schedule.rpiPin));
    this.schedulerMap = schedules.reduce((scheduleMap, schedule) => {
      const newScheduler = new DailyScheduler(
        schedule,
        state => this.gpioService.set(schedule.rpiPin, state),
      );
      const tempMap = scheduleMap;
      tempMap[schedule.id] = newScheduler;
      return tempMap;
    }, {});

    this.override = null;
  }

  async init() {
    await this.gpioService.init();
    Object.keys(this.schedulerMap)
      .forEach(scheduleKey => this.schedulerMap[scheduleKey].start());
  }

  handleOverride(status, channels) {
    if (status) {
      Object.keys(channels)
        .forEach(channel => this.schedulerMap[channel].setOverride(channels[channel]));
    } else {
      Object.keys(channels)
        .forEach(channel => this.schedulerMap[channel].clearOverride());
      this.override = null;
    }
  }

  toggleOverride(overrideId) {
    if (this.override && this.override.id === overrideId) {
      return this.stopOverride(overrideId);
    }

    return this.startOverride(overrideId);
  }

  startOverride(overrideId) {
    if (this.override) {
      throw new Error(`Cannot start override, because override (${this.override.id}) is active`);
    }
    this.override = new Override(overrideId, this.handleOverride.bind(this));
    this.override.start();
  }

  stopOverride(overrideId) {
    if (!this.override || this.override.id !== overrideId) {
      throw new Error('Cannot stop override, because no override is active');
    }

    if (this.override.id !== overrideId) {
      throw new Error(`Cannot stop override, because another override is active (${this.override.id})`);
    }

    this.override.stop();
  }

  getStatus() {
    return {
      override: this.override ? this.override.getStatus() : null,
      channels: Object.keys(this.schedulerMap).reduce((channelInfo, channelId) => {
        const tempChannelInfo = channelInfo;
        tempChannelInfo[channelId] = this.schedulerMap[channelId].currentStatus;
        return tempChannelInfo;
      }, {}),
    };
  }
}

module.exports = Scheduler;
