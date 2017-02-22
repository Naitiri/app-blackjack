// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

	'facebookAuth' : {
		'clientID' 		: '365048463882415', // your App ID
		'clientSecret' 	: 'dafc88804470967fc697c7d5a70669ae', // your App Secret
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'F5u69h716KjJkPUCjESgNoxJQ',
		'consumerSecret' 	: 'zpUMKxVCHb7V0rzOWnSjymV4GeDLZ6amS59dwZlzEx83JN82Dj',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: 'node-auth-159114',
		'clientSecret' 	: '334062697183',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

};