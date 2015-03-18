Template.userJoin.created = function() {
  Session.set('userJoinErrors', {});
}
Template.userJoin.helpers({
  errorMessage: function(field) {
    return Session.get('userJoinErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('userJoinErrors')[field] ? 'has-error' : '';
  }
});