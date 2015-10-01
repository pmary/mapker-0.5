/**
 * Mapker Users namespace
 * @namespace Users
 */
Users = Meteor.users;

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

var addressSchema = new SimpleSchema({
  countryCode: {
    type: String,
    regEx: /^[A-Z]{2}$/
  },
  zipcode: {
    type: String,
    optional: true
  },
  city: {
    type: String,
    optional: true
  },
  loc: {
    type: coordinatesSchema,
    optional: true
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

userNetworkSchema = new SimpleSchema({
  pending_requests: {
    type: [String],
    optional: true
  },
  pending_reponses: {
    type: Array,
    optional: true
  },
  "pending_reponses.$": {
    type: Object,
    optional: true
  },
  "pending_reponses.$.createdAt": {
    type: Date
  },
  "pending_reponses.$.id": {
    type: String
  },
  "pending_reponses.$.name": {
    type: String
  },
  "pending_reponses.$.read": {
    type: Boolean
  },
  "connected": {
    type: [String],
    optional: true
  }
});

networkSchema = new SimpleSchema({
  places: {
    type: Array,
    optional: true
  },
  "places.$": {
    type: Object
  },
  "places.$.id": {
    type: String
  },
  "places.$.staff": {
    type: Boolean,
    optional: true
  },
  "places.$.role": {
    type: String,
    optional: true
  },
  "places.$.admin": {
    type: Boolean,
    optional: true
  },
  "communities.$": {
    type: Object
  },
  "communities.$.id": {
    type: String
  },
  "communities.$.admin": {
    type: Boolean,
    optional: true
  },
  users: {
    type: userNetworkSchema,
    optional: true
  }
});

Meteor.users.profileSchema = new SimpleSchema({
  fullname: {
    type: String,
    optional: true
  },
  firstname: {
    type: String,
    optional: true
  },
  lastname: {
    type: String,
    optional: true
  },
  nicHandle: {
    type: String,
    regEx: /^[A-Za-z0-9_]{1,15}$/,
    max: 15
  },
  activity: {
    type: String,
    optional: true
  },
  bio: {
    type: String,
    optional: true
  },
  skills: {
    type: Array,
    optional: true
  },
  "skills.$": {
    type: Object
  },
  "skills.$.title": {
    type: String
  },
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
  links: {
    type: linksSchema,
    optional: true
  },
  network: {
    type: networkSchema,
    optional: true
  },
  unread_notifs: {
    type: Number,
    decimal: false,
    optional: true
  }
});

Meteor.users.schema = new SimpleSchema({
  //nichandle
  username: {
    type: String,
    optional: true
  },
  emails: {
    type: Array,
    optional: true
  },
  "emails.$": {
    type: Object
  },
  "emails.$.address": {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  "emails.$.verified": {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  profile: {
    type: Meteor.users.profileSchema,
    optional: true
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true
  },
  roles: {
    type: [String],
    optional: true
  }
});

Meteor.users.attachSchema(Meteor.users.schema);
