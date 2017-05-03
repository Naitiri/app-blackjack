	var mongoose   = require('mongoose');
	var bcrypt   = require('bcrypt-nodejs');
	// define the schema for our user model
	var userSchema = mongoose.Schema({

	    local            : {
	        email        : String,
	        password     : String,
			fname        : String,
	        lname	     : String,
	        avatar	     : String,
	        balance	     : {
	        	type     : Number,
	        	default  : 1000
	        },
	    },
	    facebook         : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    },
	    twitter          : {
	        id           : String,
	        token        : String,
	        displayName  : String,
	        username     : String
	    },
	    google           : {
	        id           : String,
	        token        : String,
	        email        : String,
	        name         : String
	    }

	});

	// generating a hash
	userSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	userSchema.methods.validPassword = function(password) {
	    return bcrypt.compareSync(password, this.local.password);
	};

	userSchema.methods.changeBalance = function(balance) {
	    this.local.balance = balance;
	};

	// create the model for users and expose it to our app
	module.exports = mongoose.model('User', userSchema);
