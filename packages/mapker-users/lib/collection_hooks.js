Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
  // Update the user ElasticSearch document
  Meteor.call('mapker:search/updateDocument', 'user', doc);
}, {fetchPrevious: false});
