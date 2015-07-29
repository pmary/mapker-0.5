module.exports = function () {
  ////////////////////////////////////////////
  //  Edit the name types and specialities  //
  ////////////////////////////////////////////
  this.Given(/^I have created a place$/, function (callback) {
    return this.server.call('place/create');
  });
};
