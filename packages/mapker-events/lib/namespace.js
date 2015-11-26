/**
 * The global namespace/collection for events.
 * @namespace Events
 */
Events = new Meteor.Collection('events');

if (Meteor.isServer) {
  /**
   * @memberof Events
   * @description
   * Link an event to the resource for wich it has been created
   *
   * @param {String} eventId - The id of the event
   * @param {String} members - The list of the event members
   */
  Events.linkEventToMembers = function (eventId, members) {
    check(eventId, String);
    check(members, Array);

    for (var i = 0; i < members.length; i++) {
      switch (members[i].type) {
        case 'user':
          Meteor.users.update(
            { _id: members[i].id },
            {
              $addToSet: {
                'profile.events': eventId
              }
            }
          );
        break;

        case 'place':
          Places.update(
            { _id: members[i].id },
            {
              $addToSet: {
                events: eventId
              }
            }
          );
        break;

        case 'community':
          Communities.update(
            { _id: members[i].id },
            {
              $addToSet: {
                events: eventId
              }
            }
          );
        break;

        default:

      }
    }
  };
}
