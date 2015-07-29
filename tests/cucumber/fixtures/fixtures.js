Meteor.methods({
  'reset': function () {
    Meteor.users.remove({});
  },
  'user/create': function () {
    Meteor.users.insert({
      "_id": "i4FxWHYGyQr3LyN4x",
      "emails": [ {   "address": "contact@pierre-mary.fr", "verified": false } ],
      "profile": {
        "fullname": "Pierre Mary",
        "firstname": "Pierre",
        "lastname": "Mary",
        "activity": "Développeur",
        "bio" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. \n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. ",
        "skills": [ { "title" : "Développement web" },  { "title" : "UX design" } ],
        "address" : {
          "countryCode" : "FR",
          "zipcode" : "75008",
          "city" : "Paris",
          "loc" : {  "lat": 48.8718722, "lon": 2.31764320000002 }
        },
        "avatar" : {
          "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/avatar",
          "name" : "i4FxWHYGyQr3LyN4x/avatar"
        },
        "cover" : {
          "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/i4FxWHYGyQr3LyN4x/cover",
          "name" : "i4FxWHYGyQr3LyN4x/cover"
        }
      },
      "createdAt": "2015-04-07T13:55:07.055Z",
      "services": {
        "password": {
          "bcrypt": "$2a$10$R5KsPj8VPSAe9ak8boIa2ulgz9XAxourReWKsc0D/zDPWBt9hIV/K"
        }
      }
    });
  },
  'page/create': function (page) {
    Pages.insert(page);
  }
});
