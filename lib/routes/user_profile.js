/**
 * Doc: https://github.com/iron-meteor/iron-router/blob/devel/Guide.md
 */

Router.route('/user/:id', function () {
  this.layout('UserProfileLayout');

  // render the UserProfileBio template into the yield region named "content" 
  // {{> yield "content"}}
  this.render('UserProfileBio', {
  	to: 'content',
  	//data: function () { return Posts.findOne({_id: this.params._id})
  });
});

Router.route('/user/:id/bio', function () {
  this.layout('UserProfileLayout');

  // render the UserProfileBio template into the yield region named "content" 
  // {{> yield "content"}}
  this.render('UserProfileBio', {
  	to: 'content',
  	//data: function () { return Posts.findOne({_id: this.params._id})
  });
});

Router.route('/user/:id/skills', function () {
  this.layout('UserProfileLayout');

  // render the UserProfileSkills template into the yield region named "content" 
  // {{> yield "content"}}
  this.render('UserProfileSkills', {
  	to: 'content',
  	//data: function () { return Posts.findOne({_id: this.params._id})
  });
});