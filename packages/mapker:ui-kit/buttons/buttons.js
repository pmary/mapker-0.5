Template.uiKit.onCreated(function () {
  // Initialization
  var instance = this;
  instance.isLoading = new ReactiveVar( false );

  window.setTimeout(function () {
    console.log('Timeout');
    instance.isLoading.set( true );
  }, 3000);
});

Template.uiKit.helpers({
  isLoading: function () {
    return Template.instance().isLoading.get();
	}
});
