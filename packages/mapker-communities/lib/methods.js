Meteor.methods({
  /**
   * @summary Insert a new document into the Community collection
   * @param {Object} community - The params of the community to create
   */
  'mapker:communities/insert': function (community) {
    check(community, {
      name: String,
      username: String,
      description: String
    });

    /*var resourceId = Communities.insert({

    });*/
  }
});
