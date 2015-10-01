Meteor.methods({
  /**
   * @summary Add a new NIC Handle to the collection
   * @param {String} nicHandle - The NIC to insert
   */
  'mapker:nichandle/insert': function (nicHandle) {
    check(Meteor.userId(), String);
    check(nicHandle, {
      name: String,
      resourceId: String,
      resourceType: String
    });

    // Check if the nicHandle is n available
    if (NicHandles.findOne({ name: nicHandle.name })) {
      return false;
    }
    else {
      return NicHandles.insert(nicHandle);
    }
  },
  /**
   * @summary Check if the given NIC already exist
   * @param {Sring} nicHandle - The NIC to check
   * @return {Boolan} Whether or not the NIC already exist in the collection
   */
  'mapker:nichandle/checkIfExist': function (nicHandle) {
    // Checking might be redundant because SimpleSchema already enforces the schema, but you never know
    check(nicHandle, String);

    var id = NicHandles.findOne({ name: nicHandle });
    console.log('id', id);

    if (id) {
      return true;
    }
    else {
      return false;
    }
  }
});
