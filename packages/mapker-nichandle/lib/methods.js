Meteor.methods({
  /**
   * @summary Add a new NIC Handle to the collection
   * @param {String} nicHandle - The NIC to insert
   */
  'mapker:nichandle/insert': function (nicHandle) {
    check(Meteor.userId(), String);
    check(nicHandle, String);
  },
  /**
   * @summary Check if the given NIC already exist
   * @param {Sring} nicHandle - The NIC to check
   * @return {Boolan} Whether or not the NIC already exist in the collection
   */
  'mapker:nichandle/checkIfExist': function (nicHandle) {
    // Checking might be redundant because SimpleSchema already enforces the schema, but you never know
    check(nicHandle, NicHandles.simpleSchema());

    var id = NicHandles.insert(nicHandle);

    return id;
  }
});
