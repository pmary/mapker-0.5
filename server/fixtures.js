/**
 * Set a default data set for developement purpose
 */
if (Meteor.users.find().count() === 0) {
	// Insert some fake user data
	Meteor.users.insert({
		"_id" : "JohnDoe",
		"createdAt" : Date("2014-09-30T23:21:38.724Z"),
		"services" : {
			"password" : {
				"bcrypt" : "$2a$10$1DYBgypFQYk4elFTEtx0xufOFFRx1xVdMDHaCwgeoOMy3HAqK0a/O"
			},
			"resume" : {
				"loginTokens" : [ 
					{
						"when" : Date("2014-12-02T00:26:18.438Z"),
						"hashedToken" : "BhRjGI4UczEvodYsRue2DQs8k/ORLKF2rxnLPNA2ZQ8="
					}, 
					{
						"when" : Date("2014-12-08T19:10:55.784Z"),
						"hashedToken" : "6vmHqxuoUkaiSLpzN08be2XuG5944U/8V6/aBr+KKLk="
					}, 
					{
						"when" : Date("2014-12-12T13:26:21.476Z"),
						"hashedToken" : "0y33NaOGOi3HqafOA8pJZ3/b2b4nty/g4ugFSW/X1N8="
					}
				]
			}
		},
		"emails" : [ 
			{
				"address" : "john@doe.com",
				"verified" : false
			}
		],
		"roles" : [ 
			"admin"
		],
		"profile" : {}
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