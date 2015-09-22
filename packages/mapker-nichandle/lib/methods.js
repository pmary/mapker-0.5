Meteor.methods({
  /**
   * @summary Add a new NIC Handle to the collection
   * @param {String} nicHandle - The NIC to insert
   */
  'mapker:nichandle/insert': function (nicHandle) {
    check(Meteor.userId(), String);
    check(nicHandle, String);
  }
});
