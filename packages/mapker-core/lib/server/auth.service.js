Meteor.methods({
  /**
   * @summary Check if the user has sufficient rights to edit the place
   * @param {String} placeId - The id of the user the user try to edit
   * @return {Boolean} A true/false response that indicate if the user can or not perform edition
   */
  canUserEditPlace: function (placeId) {
    check(placeId, String);
    check(Meteor.userId(), String);

    var userId = Meteor.userId();

    // Check if we can find a place that match the given place id and where the user is admin
    return Places.findOne({_id: placeId, members: { $elemMatch: { id: userId, admin: true } } });

    /*Meteor.setTimeout(function () {
      console.log('canEdit.length: ', canEdit.length);
      if (canEdit) {
        console.log('He can edit');
        return true;
      }
      else {
        return false;
      }
    }, 0);*/
  }
});