const controller = require('../middleware/uploadController');

module.exports = app => {
  app.get('/', controller.loadHome);
  app.post('/upload', controller.uploadFile);
}