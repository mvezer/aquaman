const JSONstore = require('./JSONstore');

class ScheduleStore extends JSONstore {
  constructor(channelInfo) {
    super(channelInfo.filename);
    this.id = channelInfo.id;
    this.rpiPin = channelInfo.rpi_pin;
  }

  init() {
    super.data = { schedule: [] };
    super.save();
  }
}

module.exports = ScheduleStore;
