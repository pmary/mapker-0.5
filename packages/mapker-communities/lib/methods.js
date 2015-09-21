Meteor.methods({
  /**
   * @summary Insert a new document into the Community collection
   * @param {Object} community - The params of the community to create
   */
  community_create: function (community) {
    check(community, {
      name: String,
      username: String,
      description: String
    });

    /*var resourceId = Communities.insert({

    });*/
  }
});
