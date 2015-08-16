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
