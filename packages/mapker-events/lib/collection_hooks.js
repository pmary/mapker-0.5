Events.after.insert(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'event', doc);
}, {fetchPrevious: false});


Events.after.update(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'event', doc);
}, {fetchPrevious: false});
