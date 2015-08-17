/**
 * @summary Return the role of a place member if he has one
 */
UI.registerHelper('place_memberRole', function(memberProfile) {
  var placeId = Router.current().params._id;
  if (
    placeId &&
    memberProfile &&
    memberProfile.network &&
    memberProfile.network.places &&
    memberProfile.network.places.length
  ) {
    for (var i = 0; i < memberProfile.network.places.length; i++) {
      if (memberProfile.network.places[i].id === placeId) {
        return memberProfile.network.places[i].role;
      }
    }
  }
  return false;
});

/**
 * @summary Check if the user is a place staff member or not
 * @param {Array} placeMembers
 */
UI.registerHelper('place_isStaffMember', function (placeMembers) {
  var user = Meteor.user();
  if (
    user &&
    placeMembers &&
    placeMembers.length
  ) {
    for (var i = 0; i < placeMembers.length; i++) {
      if (placeMembers[i].id === user._id && placeMembers[i].staff === true) {
        return true;
      }
    }
  }

  return false;
});
