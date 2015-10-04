/**
 * @summary Publish a community by it's id
 */
Meteor.publish('community', function(communityId) {
	check(communityId, String);
	return Communities.find({_id: communityId});
});
