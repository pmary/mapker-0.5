Router.route('/ui-kit', {
	name: 'uiKit',
	template: 'uiKit',
  onAfterAction: function () {
    $('body,html').scrollTop(0);
  },
	after: function() {
		// Send the pageview to GA
		ga('send', 'pageview', '/privacy');
	}
});
