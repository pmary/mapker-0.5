Places.after.update(function (userId, doc, fieldNames, modifier, options) {
  if (doc.activated) {
    // Update the place ElasticSearch document
    Meteor.call('mapker:search/updateDocument', 'place', doc);
   }
}, {fetchPrevious: false});
