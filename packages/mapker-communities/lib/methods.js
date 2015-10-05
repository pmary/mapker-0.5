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

    var communityId;

    if (Meteor.isServer) {
			// Check if the nichandle already existe
			if (NicHandles.findOne({ canonicalName: community.username.toLowerCase() })) {
				return false;
			}
			else {
        // Insert the community
        communityId = Communities.insert({
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

        // Update the community document indexed by ES
        Meteor.call('mapker:search/updateDocument', communityId, 'community');
      }
    }

    // Return the community id
    return communityId;
  },
  /**
   * @summary Update a document
   * @param {Object} community - The params of the community to create
   */
  'mapker:communities/updateIdentity': function (community) {
    check(Meteor.userId(), String);
    check(community, Object);

    // Check if the user has sufficient rigths
    if (Meteor.call('mapker:core/canUserEditCommunity', community.id)) {
      Communities.update(community.id, {$set: {name: community.name}});

      // Update the community document indexed by ES
      Meteor.call('mapker:search/updateDocument', community.id, 'community');
    }
  },
  /**
   * @summary Update a document
   * @param {Object} community - The params of the community to create
   */
  'mapker:communities/updateLinks': function (community) {
    check(Meteor.userId(), String);
    check(community, Object);

    // Check if the user has sufficient rigths
    if (Meteor.call('mapker:core/canUserEditCommunity', community.id)) {
      Communities.update(community.id, { $set: {
        'links.facebook': community.facebook,
        'links.flickr': community.flickr,
        'links.twitter': community.twitter,
        'links.website': community.website
      } });
    }
  },
  /**
   * @summary Remove the links of the community document
   * @param {Object} community - The params of the community
   */
  'mapker:communities/removeLinks': function (communityId) {
    check(Meteor.userId(), String);
    check(communityId, String);

    // Check if the user has sufficient rigths
    if (Meteor.call('mapker:core/canUserEditCommunity', communityId)) {
      Communities.update(communityId, { $unset: { 'links': '' } });
    }
  },
  /**
   * @summary Update the community description
   * @param {Object} community - The id and description of the community
   */
  'mapker:community/updateDescription': function (community) {
    check(Meteor.userId(), String);
    check(community, {
      id: String,
      description: String
    });

    // Check if the user has sufficient rigths
    if (Meteor.call('mapker:core/canUserEditCommunity', community.id)) {
      Communities.update(community.id, { $set: { 'description': Mapker.utils.removeTags(community.description)} });

      // Update the community document indexed by ES
      Meteor.call('mapker:search/updateDocument', community.id, 'community');
    }
  }
});
