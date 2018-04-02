const RestServer = require('./infrastructure/RestServer');
const config = require('./infrastructure/ConfigStore');
const ScheduleStore = require('./infrastructure/ScheduleStore');
const Scheduler = require('./usecase/Scheduler');

let scheduler;

const restServer = new RestServer(config.get('PORT'), 'Aquaman');

const handleFeeding = (req, res, next) => {
  try {
    scheduler.toggleOverride('feeding');
    res.send(200, { status: 'OK', result: scheduler.getStatus() });
    next();
  } catch (error) {
    res.send(500, { status: 'ERROR', message: error.message });
    next();
  }
};

const handleMaintenance = (req, res, next) => {
  try {
    scheduler.toggleOverride('maintenance');
    res.send(200, { status: 'OK', result: scheduler.getStatus() });
    next();
  } catch (error) {
    res.send(500, { status: 'ERROR', message: error.message });
    next();
  }
};

const handlePersistSchedule = (req, res, next) => {
  res.send(200, { status: 'OK' });
  next();
};

const handleGetSchedule = (req, res, next) => {
  res.send(200, { status: 'OK' });
  next();
};

const handleGetStatus = (req, res, next) => {
  res.send(200, { status: 'OK', result: scheduler.getStatus() });
  next();
};

const server = async () => {
  restServer.start();
  scheduler = new Scheduler(config.get('CHANNELS').map(channelInfo => new ScheduleStore(channelInfo)));
  await scheduler.init();
};
// ----------------------- routes -----------------------
restServer.addRoute('PUT', '/api/feeding', handleFeeding);
restServer.addRoute('PUT', '/api/maintenance', handleMaintenance);
restServer.addRoute('GET', '/api/status', handleGetStatus);
restServer.addRoute('POST', '/api/schedule/:channelName', handlePersistSchedule);
restServer.addRoute('GET', '/api/schedule/:channelName', handleGetSchedule);
restServer.serveHtml('/*', 'dist');

server();
