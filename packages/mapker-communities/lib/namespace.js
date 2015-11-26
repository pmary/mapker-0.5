/**
 * The global namespace/collection for communities.
 * @namespace Places
 */
Communities = new Meteor.Collection('communities');

var linksSchema = new SimpleSchema({
  facebook  : { type: SimpleSchema.RegEx.Url, optional: true },
  flickr    : { type: SimpleSchema.RegEx.Url, optional: true },
  twitter   : { type: SimpleSchema.RegEx.Url, optional: true },
  website   : { type: SimpleSchema.RegEx.Url, optional: true },
  linkedin  : { type: SimpleSchema.RegEx.Url, optional: true },
  github    : { type: SimpleSchema.RegEx.Url, optional: true },
  tumblr    : { type: SimpleSchema.RegEx.Url, optional: true },
  instagram : { type: SimpleSchema.RegEx.Url, optional: true },
  behance   : { type: SimpleSchema.RegEx.Url, optional: true },
  pinterest : { type: SimpleSchema.RegEx.Url, optional: true },
  vimeo     : { type: SimpleSchema.RegEx.Url, optional: true }
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

var imageSchema = new SimpleSchema({
  url: {
    type: SimpleSchema.RegEx.Url
  },
  name: {
    type: String
  }
});

Communities.schema = new SimpleSchema({
  name: {
    type: String,
    max: 50
  },
  nicHandle: {
    type: String,
    regEx: /^[A-Za-z0-9_]{1,15}$/,
    max: 15
  },
  members: {
    type: Array,
    optional: true
  },
  "members.$": {
    type: Object
  },
  "members.$.id": {
    type: String
  },
  "members.$.role": {
    type: String,
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
  description: {
    type: String,
    optional: true
  },
  events: {
    type: [String],
    optional: true
  },
  links: {
    type: linksSchema,
    optional: true
  },
  loc: {
    type: coordinatesSchema,
    optional: true
  }
});
