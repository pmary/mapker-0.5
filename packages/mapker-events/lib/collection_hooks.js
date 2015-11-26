Events.after.insert(function (userId, doc, fieldNames, modifier, options) {

  if (Meteor.isServer) {
    // Update the creator document to add him the event to his list
    Events.linkEventToMembers(doc._id, doc.members);
  }

  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'event', doc);

}, {fetchPrevious: false});


Events.after.update(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'event', doc);
}, {fetchPrevious: false});


Events.after.remove(function (userId, doc) {
  console.log('An event has been removed');
}, {fetchPrevious: false});
