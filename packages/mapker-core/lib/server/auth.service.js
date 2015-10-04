Meteor.methods({
  /**
   * @summary Check if the user has sufficient rights to edit the place
   * @param {String} placeId - The id of the user the user try to edit
   * @return {Boolean} A true/false response that indicate if the user can or not perform edition
   */
  'mapker:core/canUserEditPlace': function (placeId) {
    check(placeId, String);
    check(Meteor.userId(), String);

    // Check if we can find a place that match the given place id and where the user is admin
    return Places.findOne({_id: placeId, members: { $elemMatch: { id: Meteor.userId(), admin: true } } });
  },
  /**
   * @summary Check if the user has sufficient rights to edit the community
   * @param {String} id - The id of the community the user try to edit
   * @return {Boolean} A true/false response that indicate if the user can or not perform edition
   */
  'mapker:core/canUserEditCommunity': function (id) {
    check(id, String);
    check(Meteor.userId(), String);

    // Check if we can find a community that match the given id and where the user is admin
    return Communities.findOne({_id: id, members: { $elemMatch: { id: Meteor.userId(), admin: true } } });
  }
});
