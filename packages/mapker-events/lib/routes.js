Router.route('/create-an-event', {
  name: 'createEvent',
  template: 'createEvent',
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
  after: function () {
    // Send the pageview to GA
    ga('send', 'pageview', '/create-an-event');
  }
});
