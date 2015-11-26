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
  address: {
    type: addressSchema,
    optional: true
  },
  avatar: {
    type: imageSchema,
    optional: true
  },
  cover: {
    type: imageSchema,
    optional: true
  },
  createdAt: {
    type: Date,
    defaultValue: new Date()
  },
  createdBy: {
    type: String
  },
  end: {
    type: Date
  },
  link: {
    type: SimpleSchema.RegEx.Url
  },
  "members.$": {
    type: Object,
    optional: true
  },
  "members.$.id": {
    type: String
  },
  "members.$.type": {
    type: String
  },
  "members.$.admin": {
    type: Boolean,
    optional: true
  },
  "members.$.organizer": {
    type: Boolean,
    optional: true
  },
  "members.$.contributor": {
    type: Boolean,
    optional: true
  },
  "members.$.role": {
    type: String,
    optional: true
  },
  name: {
    type: String,
    max: 50
  },
  start: {
    type: Date
  },
});
