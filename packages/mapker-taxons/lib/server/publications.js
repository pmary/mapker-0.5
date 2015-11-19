/*****************************************************************************/
/* Taxons publications */
/*****************************************************************************/
/**
 * @summary Get all the taxons
 */
Meteor.publish("allTaxons", function() {
  return Taxons.find({});
});

/**
 * @summary Get all the taxon related to the Events collection
 */
 Meteor.publish("eventsTaxons", function () {
 	return Taxons.find({collection: 'events'});
 });


/**
 * @summary Get all the taxon related to the Machines collection
 */
 Meteor.publish("machinesTaxons", function () {
 	return Taxons.find({collection: 'machines'});
 });
