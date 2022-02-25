const init = require('../config/init').index();

class MainController {
  async service(req, res) {
    res.send(init)
  }
}

module.exports = new MainController();