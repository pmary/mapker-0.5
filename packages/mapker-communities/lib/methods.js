Meteor.methods({
  /**
   * @summary Insert a new document into the Community collection
   * @param {Object} community - The params of the community to create
   */
  'mapker:communities/insert': function (community) {
    check(Meteor.userId(), String);
    check(community, {
      name: String,
      username: String,
      description: Match.Optional(String)
    });

    if (Meteor.isServer) {
			// Check if the nichandle already existe
			if (NicHandles.findOne({ canonicalName: community.username.toLowerCase() })) {
				return false;
			}
			else {
        // Insert the community
        var communityId = Communities.insert({
          name: community.name,
          nicHandle: community.username,
          description: community.description,
          members: [
            {
              id: Meteor.userId(),
              admin: true
          }
          ]
        });

        // Insert a new nicHandle
				NicHandles.insert({
					name: community.username,
          canonicalName: community.username.toLowerCase(),
					resourceId: communityId,
					resourceType: 'community'
				});

        // Update the user profile by adding him the community
        var userUpdated = Meteor.users.update(
    			{_id: Meteor.userId()},
    			{
    				$addToSet: {
    					'profile.network.communities': {
    						id: communityId,
    						admin: true
    					}
    				}
    			});
      }
    }

    return true;
  }
});
