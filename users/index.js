var userDb = require("./userDb");
var Users = require("./userClass")(userDb);

function createUser(name, email) {
	var user = new Users(name, email);
	// vasya.hello();
	console.log(user);
	console.log(user.checkEmail());
}

module.exports = createUser;

