/**
 * Machines schema
 * @type {SimpleSchema}
 */
Machines.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  }
});

/**
 * Attach schema to Posts collection
 */
Machines.attachSchema(Machines.schema);

// Declare the machinesTaxonomy collection
MachinesTaxonomy = new Meteor.Collection('machinesTaxonomy');
