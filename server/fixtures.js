/**
 * Set a default data set for developement purpose
 */
if (Meteor.users.find().count() === 0) {
	// Insert some fake user data
};

if (Labs.find().count() === 0) {
	// Insert some fake lab data
};

if (Machines.find().count() === 0) {
	// Insert some fake machine data
};

if (Places.find().count() === 0) {
	// Insert some fake place data
};

if (Projects.find().count() === 0) {
	// Insert some fake project data
};