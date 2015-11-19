/**
 * The global namespace/collection for events.
 * @namespace Events
 */
Events = new Meteor.Collection('events');

var imageSchema = new SimpleSchema({
  url: {
    type: SimpleSchema.RegEx.Url
  },
  name: {
    type: String
  }
});

var addressSchema = new SimpleSchema({
  city: {
    type: String,
    optional: true
  },
  countryCode: {
    type: String,
    regEx: /^[A-Z]{2}$/
  },
  formattedAddress: {
    type: String,
    optional: true
  },
  zipcode: {
    type: String,
    optional: true
  },
  loc: {
    type: coordinatesSchema,
    optional: true
  }
});

var coordinatesSchema = new SimpleSchema({
  lat: {
    type: Number,
    decimal: true
  },
  lon: {
    type: Number,
    decimal: true
  }
});

Events.schema = new SimpleSchema({
  name: {
    type: String,
    max: 50
  },
  avatar: {
    type: imageSchema,
    optional: true
  },
  cover: {
    type: imageSchema,
    optional: true
  },
  address: {
    type: addressSchema,
    optional: true
  },
  createdAt: {
    type: Date
  },
  date: {
    type: Date
  },
});
