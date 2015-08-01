Meteor.methods({
  'cucumber/reset': function () {
    Meteor.users.remove({});
  },
  'cucumber/login': function () {
    if (Meteor.isClient) {
      return Meteor.loginWithPassword('contact@pierre-mary.fr', 'mapker42', function(error){
  			if (error){
          return error;
  			}else {
  				console.log('no-login error');
  			}
  		});
    }
  },
  'cucumber/user/create-full-profile': function () {
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
  'cucumber/user/create-with-no-bio': function () {
    Meteor.users.insert({
      "_id": "i4FxWHYGyQr3LyN4x",
      "emails": [ {   "address": "contact@pierre-mary.fr", "verified": false } ],
      "profile": {
        "fullname": "Pierre Mary",
        "firstname": "Pierre",
        "lastname": "Mary",
        "activity": "Développeur",
        "address" : {
          "countryCode" : "FR",
          "zipcode" : "75008",
          "city" : "Paris",
          "loc" : {  "lat": 48.8718722, "lon": 2.31764320000002 }
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
  'cucumber/user/create-with-no-profile': function () {
    Meteor.users.insert({
      "_id": "i4FxWHYGyQr3LyN4x",
      "emails": [ {   "address": "contact@pierre-mary.fr", "verified": false } ],
      "profile": {
        "fullname": "Pierre Mary",
        "firstname": "Pierre",
        "lastname": "Mary"
      },
      "createdAt": "2015-04-07T13:55:07.055Z",
      "services": {
        "password": {
          "bcrypt": "$2a$10$R5KsPj8VPSAe9ak8boIa2ulgz9XAxourReWKsc0D/zDPWBt9hIV/K"
        }
      }
    });
  },
  'cucumber/place/create': function () {
    Places.insert({
      "_id" : "mSxtrL7doRdpS2LND",
      "name" : "ICI MONTREUIL",
      "specialities" : [  "wood",  "metal",  "electronics",  "graphism" ],
      "phone" : "0681219432",
      "types" : [  "fablab",  "coworking" ],
      "streetNumber" : "135",
      "streetName" : "Boulevard Chanzy",
      "zipcode" : "93100",
      "countryCode" : "fr",
      "city" : "Montreuil",
      "loc" : { "lat" : 48.8587828, "lon" : 2.4259452 },
      "formattedAddress" : "135 Boulevard Chanzy, 93100 Montreuil, France",
      "activated" : false,
      "submittedBy" : "tJ2QyY4gHoSWsutqP",
      "submittedAt" : Date("2015-06-12T10:23:49.058Z"),
      "openingHours" : [
          { "d" : "mo", "s" : "8:30", "e" : "20:30" },
          { "d" : "tu", "s" : "0:00", "e" : "1:00" },
          { "d" : "we", "c" : true },
          { "d" : "th", "c" : true },
          { "d" : "fr", "c" : true },
          { "d" : "sa", "c" : true },
          { "d" : "su", "c" : true }
      ],
      "about" : "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
      "members" : [
          { "id" : "cAqconthf92Yrnutf", "admin" : true, "staff" : true },
          { "id" : "i4FxWHYGyQr3LyN4x", "admin" : true }
      ],
      "avatar" : {
          "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/mSxtrL7doRdpS2LND/avatar-1437134382071",
          "name" : "mSxtrL7doRdpS2LND/avatar-1437134382071"
      },
      "cover" : {
          "url" : "https://la-paillasse.s3.eu-central-1.amazonaws.com/mSxtrL7doRdpS2LND/cover-1437134540807",
          "name" : "mSxtrL7doRdpS2LND/cover-1437134540807"
      },
      "links" : { "facebook" : "http://dff.cm", "flickr" : "http://dfgfg.fl", "twitter" : "http://sdf.fr", "website" : "" }
    });
  }
});
