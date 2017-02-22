function run(mongoose){
	var express = require("express");
	var app = express();
	var port     = process.env.PORT || 8080;
	var router = require("./router");
	var passport = require('passport');
	var flash    = require('connect-flash');

	app.set('view engine', 'ejs');
	
	require('../config/passport')(passport); // pass passport for configuration

// app.configure(function() {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	// app.set('view engine', 'ejs'); // set up ejs for templating
	// app.use('/', express.static(__dirname + '/public'));
	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
// });


	app.use('/', express.static(__dirname + '/../public'));

	require('../server/routes.js')(app, passport);

	app.listen(port, function(){
		router(app, mongoose);
		console.log("listening " + port + " port");
	})

}

module.exports = run;
