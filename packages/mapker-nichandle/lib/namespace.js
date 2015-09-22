/**
 * The global namespace/collection for nic-handles.
 * @namespace NicHandles
 */
NicHandles = new Meteor.Collection('nichandles');

/**
 * NicHandles schema
 * @type {SimpleSchema}
 */
NicHandles.schema = new SimpleSchema({
  /**
    ID
  */
  _id: {
    type: String,
    optional: true
  },
  /**
    The name of the NIC Handle
  */
  name: {
    type: String,
    index: 1,
    unique: true,
    regEx: /^[A-Za-z0-9_]{1,20}$/,
    max: 15
  },
  /**
    The `_id` of the resource relatd to the NIC Handle
  */
  resourceId: {
    type: String,
    // regEx: SimpleSchema.RegEx.Id,
    max: 500,
    autoform: {
      omit: true // never show this
    }
  },
  /**
    The type of the resource relatd to this NIC Handle
  */
  resourceType: {
    type: String,
    allowedValues: ['user', 'community', 'place', 'project'],
    max: 15,
    autoform: {
      omit: true // never show this
    }
  }
});

NicHandles.attachSchema(NicHandles.schema);
