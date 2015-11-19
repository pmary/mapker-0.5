Template.adminAddTaxon.onCreated(function () {
  this.collection = new ReactiveVar( 'events' );
});

Template.adminAddTaxon.helpers({
  collection: function () {
    return Template.instance().collection.get();
  },
});

Template.adminAddTaxon.events({
  /**
   * @description
   * At the collection select change, set 'collection' reactive var with
   * the selected collection name
   */
  'change #select-collection': function (e, t) {
    var collection = t.find('#select-collection').value;
    Template.instance().collection.set( collection );
  },
  /**
   * @description
   * At the taxon form submission, check the data and create the taxon
   */
  'submit .add-taxon-form': function (e, t) {
    e.preventDefault();

    var taxon = {
      name: t.find('#input-name').value,
      collection: t.find('#select-collection').value,
      category: t.find('#select-category').value
    };
    console.log('taxon', taxon);

    Meteor.call('mapker:taxons/taxonsAddNew', taxon, function (error) {
      if (error) return console.log(error);
      Router.go('adminTaxons');
    });
  }
});
