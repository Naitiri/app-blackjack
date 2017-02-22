var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/blackjack');

var db = mongoose.connection;

db.once('open', function() {
	var userSchema = new mongoose.Schema({
		fname : String,
		lname : String,
		email : String,
		passwd : String
	});

	var userModel = mongoose.model("userModel", userSchema);

	var user = new userModel({
				fname : "ivan",
				lname : "petrov",
				email : "petrov55@gmail.com",
				passwd : "654sdf1"
			});
	
// saving data
	// user.save(function(err){
	// 	if(err) {console.log(err); return;}
	// 	console.log("User saved!");
	// });

//выведет пользователей с емайлом и паролем
userModel.find( {'email' : user.email}, 
					'email', 
					function(err, userEmail){
						
						if(userEmail.length) {
							console.log("Such email already used!");
						} else {
							user.save(function(err){
								if(err) {console.log(err); return;}
								console.log("User saved!");
							});
						}
		
				});
})

// userModel.find ({'fname'})


