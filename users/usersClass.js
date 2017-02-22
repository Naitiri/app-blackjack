function wrap(userDb) {

	function Users(name, email){
	this.name = name;
	this.email = email;
	}

	Users.prototype.hello = function(){
		console.log("User " + this.name + " says Hello!");
	}


	Users.prototype.checkEmail = function(){

		for(var i = 0; i < userDb.lenght; i++) {
			if(userDb[i].email === this.email) {
				return true;
			}
			return false;
		}
	}
	return Users;
}


module.exports = wrap;