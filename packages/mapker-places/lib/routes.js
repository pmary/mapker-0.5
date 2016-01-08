Router.route('/suggest-a-place', {
  name: 'suggestPlace',
  yieldRegions: {
		'suggestPlace': {to: 'content'},
    'primaryNavbar': {to: 'nav'},
    'footer': {to: 'footer'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  after: function () {
    // Send the pageview to GA
		ga('send', 'pageview', '/suggest-a-place');
  }
});

Router.route('/create-a-place', {
  name: 'createPlace',
  layoutTemplate: 'CoreMainLayout',
  yieldRegions: {
		'createPlace': {to: 'content'},
    'primaryNavbar': {to: 'nav'}
	},
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/create-a-place');
  }
});

Router.route('/places/:_id', {
  name: 'placeProfile',
  template: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileAbout': {to: 'content'}
  },
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  waitOn: function () {
  },
  data: function () {
  },
  after: function () {

  }
});

Router.route('/places/:_id/about', {
  name: 'placeProfileAbout',
  template: 'placeProfileAbout',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileAbout': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places/'+this.params._id+'/about');

    // Set the tab as active
    $('.place-profile-page .nav li').removeClass('active');
    $('.place-profile-page .nav li#nav-about').addClass('active');
  }
});

Router.route('/places/:_id/opening-hours', {
  name: 'placeProfileTimetable',
  template: 'placeProfileTimetable',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileTimetable': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places'+this.params._id+'/opening-hours');

    // Set the tab as active
    $('.place-profile-page .nav li').removeClass('active');
    $('.place-profile-page .nav li#nav-opening-hours').addClass('active');
  }
});

Router.route('/places/:_id/machines', {
  name: 'placeProfileMachines',
  template: 'placeProfileMachines',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileMachines': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places'+this.params._id+'/machines');

    // Set the tab as active
    $('.place-profile-page .nav li').removeClass('active');
    $('.place-profile-page .nav li#nav-machines').addClass('active');
  }
});

Router.route('/places/:_id/staff', {
  name: 'placeProfileStaff',
  template: 'placeProfileStaff',
  layoutTemplate: 'placeProfileLayout',
  yieldRegions: {
    'placeProfileStaff': {to: 'content'}
  },
  waitOn: function () {
    return Meteor.subscribe('place', this.params._id);
  },
  data: function () {
    templateData = {
      place: Places.findOne({_id: this.params._id})
    };
    return templateData;
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/places'+this.params._id+'/staff');

    // Set the tab as active
    $('.place-profile-page .nav li').removeClass('active');
    $('.place-profile-page .nav li#nav-staff').addClass('active');
  }
});
