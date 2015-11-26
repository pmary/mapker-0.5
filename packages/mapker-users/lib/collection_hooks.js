Meteor.users.after.update(function (userId, doc, fieldNames, modifier, options) {
  // If the modified fields are under 'profile'
  if (fieldNames.indexOf('profile') > -1) {
    // Update the user ElasticSearch document
    Meteor.call('mapker:search/updateDocument', 'user', doc);
  }
}, {fetchPrevious: false});
