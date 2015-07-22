Taxons = new Mongo.Collection('taxons');

Meteor.methods({
  taxonsAddNew: function (taxon) {
    check(Meteor.userId(), String); // Check if the user is loged in
    check(taxon, Object);

    var taxonId = Taxons.insert(taxon);

    return taxonId;
  }
});
