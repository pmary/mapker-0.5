Template.userProfileNetwork.rendered = function(){
};

Template.userProfileNetwork.helpers({
  /**
   * @summary Get the data of the connected users
   */
   hasConnexions: function () {
     if (this.user) {
       var user = this.user;
       if ( user && user.profile.network && user.profile.network.users && user.profile.network.users.connected ) {
         return user.profile.network.users.connected.length;
       }
     }
   }
});

Template.userProfileNetwork.events({
  'click .user-go-skills-search': function () {
    Router.go('searchSkills');
  }
});
