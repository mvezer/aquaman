const moment = require('moment');
const config = require('./ConfigStore');

class DailyScheduler {
  constructor(configStore, callback) {
    this.configStore = configStore;
    this.callback = callback;
    this.timeoutObj = null;
    this.scheduleArr = [];
    this.override = null;
    this.currentStatus = false;

    if (this.configStore.data === null || this.configStore.data === undefined) {
      throw new Error('Config store is not initialized');
    }

    if (this.configStore.data.schedule === null || this.configStore.data.schedule === undefined) {
      throw new Error('Config store data is invalid');
    }

    this.init();
  }

  init() {
    this.scheduleArr = this.configStore.data.schedule.map(scheduleItem =>
      ({
        index: 0,
        time: moment(scheduleItem.time, config.get('TIME_FORMAT')).diff(moment().startOf('day')),
        value: scheduleItem.value.toLowerCase() === 'on',
      }));
    this.scheduleArr.sort((item1, item2) => (item1.time - item2.time));
    this.scheduleArr.forEach((item, idx) => { this.scheduleArr[idx].index = idx; });
  }

  getNowMS() {
    return moment().diff(moment().startOf('day'));
  }

  getLastItem() {
    const nowMS = this.getNowMS();
    const firstItem = this.scheduleArr[0];
    const lastItem = this.scheduleArr[this.scheduleArr.length - 1];
    if (nowMS < firstItem.time || nowMS >= lastItem.time) {
      return lastItem;
    }

    return this.scheduleArr.find((item, idx, arr) => {
      if (idx === arr.length) {
        return false;
      }
      const nextItem = arr[idx + 1];
      return nowMS >= item.time && nowMS < nextItem.time;
    });
  }

  getNextItem() {
    const firstItem = this.scheduleArr[0];

    const previousItem = this.getLastItem();
    if (previousItem.index === this.scheduleArr.length - 1) {
      return firstItem;
    }

    return this.scheduleArr[previousItem.index + 1];
  }

  handler(value) {
    this.stop();
    this.callback(value);
    this.currentStatus = value;
    const nowMS = this.getNowMS();
    const nextItem = this.getNextItem();
    const deltaTime = nowMS <= nextItem.time ?
      nextItem.time - nowMS :
      moment()
        .startOf('day')
        .add(1, 'day')
        .add(nextItem.time, 'milliseconds')
        .diff(moment());
    this.timeoutObj = setTimeout(this.handler.bind(this, nextItem.value), deltaTime);
  }

  start() {
    this.handler(this.getLastItem().value);
  }

  stop() {
    if (!this.timeoutObj) {
      clearTimeout(this.timeoutObj);
      this.timeoutObj = null;
    }
  }

  setOverride(override) {
    this.override = override;
    this.stop();
    this.callback(this.override);
    this.currentStatus = override;
  }

  clearOverride() {
    if (this.override !== null) {
      this.override = null;
      this.start();
    }
  }

  isRunning() {
    return this.timeoutObj !== null;
  }
}

module.exports = DailyScheduler;
