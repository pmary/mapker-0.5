Template.coreProfileLayout.onCreated(function () {
  // Initialization
  var instance = this;
  instance.isAdmin = new ReactiveVar( false );

  instance.autorun(function() {
    // Define if the user has admin right over this profile
    // (depend of the profile type)
    if (Meteor.userId())
    switch (instance.data.type) {
      case 'user':
        if (instance.data.doc._id === Meteor.userId()) {
          instance.isAdmin.set( true );
          console.log('Is user admin');
        }
      break;
      default:

    }
  });

});

Template.coreProfileLayout.helpers({
  isAdmin: function () {
    return Template.instance().isAdmin.get();
  }
});
