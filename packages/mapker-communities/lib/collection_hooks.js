Communities.after.insert(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'community', doc);
}, {fetchPrevious: false});


Communities.after.update(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'community', doc);
}, {fetchPrevious: false});
