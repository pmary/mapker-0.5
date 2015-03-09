/**
 * Set a default data set for developement purpose
 */
if (Meteor.users.find().count() === 0) {
	// Insert some fake user data
	Meteor.users.insert({
	    "_id" : "aRWQgD69236KGBdpG",
	    "createdAt" : Date("2014-09-30T23:21:38.724Z"),
	    "emails" : [ 
	        {
	            "address" : "contact@pierre-mary.fr",
	            "verified" : false
	        }
	    ],
	    "profile" : {
	        "firstname" : "Pierre",
	        "lastname" : "Mary"
	    },
	    "services" : {
	        "password" : {
	            "bcrypt" : "$2a$10$84ZnKfSJYdLRVJZLVRwUJeLHWvACobch484csP7bd9C1RZw3hUwNK",
	            "reset" : {
	                "token" : "QYPKWuP-S_Xwu0DWW9VIZMYJxaV6pajt8RTN4ixijtZ",
	                "email" : "contact@pierre-mary.fr",
	                "when" : Date("2014-09-30T23:21:38.724Z")
	            }
	        },
	        "resume" : {
	            "loginTokens" : [ 
	                {
	                    "when" : Date("2014-09-30T23:21:38.724Z"),
	                    "hashedToken" : "xvk8lSswpb/ZgjlyajAWarNlU5LtnDtCgDeD+dKte+k="
	                }
	            ]
	        }
	    }
	});
};

if (Labs.find().count() === 0) {
	// Insert some fake lab data
};

if (Machines.find().count() === 0) {
	// Insert some fake machine data
};

if (Places.find().count() === 0) {
	// Insert some fake place data
	Places.insert({
		_id: "j7gq8Pc9ZDS8EuG89",
	    administrators: [
	        "s6bx9toeqhDoSbzyd", 
	        "nb6iTbrTKNH4KtePh"
	    ],
	    activities: "Fablab",
	    activated: true,
	    machines: [],
	    city: "Rennes",
	    country: "FR",
	    county: "Rennes",
	    loc: [48.868499, 2.352093],
	    postalCode: 35000,
	    state: "Brittany",
	    street: "34 Rue Hoche",
	    submittedBy: "s6bx9toeqhDoSbzyd",
	    submittedOn: Date("2014-10-03T23:50:22.959Z"),
	    title: "Labfab",
	    avatar: "ojEzCbmh4cfykyiaH"
	});
};

if (Projects.find().count() === 0) {
	// Insert some fake project data
};