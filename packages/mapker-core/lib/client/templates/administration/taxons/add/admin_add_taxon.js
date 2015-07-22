Template.adminAddTaxon.events({
  'submit .add-taxon-form': function (e, t) {
    console.log('submit .add-taxon-form');

    e.preventDefault();

    var taxon = {
      name: t.find('#input-name').value,
      collection: t.find('#select-collection').value,
      category: t.find('#select-category').value
    };
    console.log('taxon', taxon);

    Meteor.call('taxonsAddNew', taxon, function (error) {
      if (error) return console.log(error);
      Router.go('adminTaxons');
    });
  }
});
