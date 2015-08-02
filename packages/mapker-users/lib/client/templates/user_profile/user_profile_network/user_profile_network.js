Template.userProfileNetwork.rendered = function(){
};

Template.userProfileNetwork.helpers({
  /**
   * @summary Get the data of the connected users
   */
   userNetwork: function () {
     if (this.user) {
       var user = this.user,
       userNetwork = [];
       
       if ( user && user.profile.network && user.profile.network.users && user.profile.network.users.connected ) {
         // Subscribe to users
         Meteor.subscribe("users", user.profile.network.users.connected);
         //console.log('This user have a network');
         userNetwork = Meteor.users.find({ _id: { $in: user.profile.network.users.connected } }).fetch();
         //console.log('userNetwork', userNetwork);
       }
       return userNetwork;
     }
   }
});

Template.userProfileNetwork.events({

});
