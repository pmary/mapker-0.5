module.exports = function () {
  this.Before(function () {
    return this.server.call('cucumber/reset');
  });
};
