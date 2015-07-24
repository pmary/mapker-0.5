/**
 * @summary Get all the taxon related to the Machines collection
 */
 Meteor.publish("machinesTaxons", function () {
 	return Taxons.find({collection: 'machines'});
 });

/*****************************************************************************/
/* Taxons publications */
/*****************************************************************************/
/**
 * @summary Get all the taxons
 */
Meteor.publish("allTaxons", function() {
  return Taxons.find({});
});
