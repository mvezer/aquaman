const restify = require('restify');
const path = require('path');

const ALLOWED_VERBS = ['del', 'get', 'head', 'opts', 'post', 'put', 'patch'];

class RestServer {
  constructor(port, name) {
    this.port = port;
    this.name = name;
    this.server = restify.createServer({ name });
  }

  init() {
    this.server.use(restify.plugins.acceptParser(this.server.acceptable));
    this.server.use(restify.plugins.queryParser());
    this.server.use(restify.plugins.bodyParser());
  }

  start(callback) {
    this.init();
    this.server.listen(this.port, callback || (() => {
      // eslint-disable-next-line no-console
      console.log(`${this.server.name} at ${this.server.url} is listening`);
    }));
  }

  addRoute(method, url, handler) {
    const sanitizedMethod = method.trim().toLowerCase();
    if (!ALLOWED_VERBS.includes(sanitizedMethod)) {
      throw new Error(`Invalid verb used for adding route: ${sanitizedMethod}`);
    }
    this.server[sanitizedMethod](url, handler);
  }

  serveHtml(url, searchDir) {
    this.addRoute('GET', url, restify.plugins.serveStatic({
      directory: path.join(searchDir),
      default: 'index.html',
    }));
  }
}

module.exports = RestServer;
