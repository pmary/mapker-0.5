/**
 * @summary Publish all the Countries
 */
 /*TAPi18n.publish('countriesList', function () {
   //check(query, Object);
   //return Countries.i18nFind();
   return true;
 });*/

 Meteor.publish('countriesList', function () {
   //check(query, Match.Optional(Object));
   return Countries.find();
 });
