function run(app, passport, io, userModel){
	// require("./socket.js")(io);
	
	var dataToTemplate = {};

	app.use(function(req, res, next){
		dataToTemplate = {
			auth:req.isAuthenticated()
		}
		next();
	});

	app.get("/", function(req, res){
		dataToTemplate.page = "main";
		dataToTemplate.message = req.flash('loginMessage');
	
		res.render('template',  dataToTemplate);
	})

	app.get("/about", function(req, res){
		dataToTemplate.page = "about";
		res.render('template',  dataToTemplate);
	})

	app.get("/game", isLoggedIn, function(req, res){

		dataToTemplate.page = "game";
		res.render('template', dataToTemplate );
	})

	app.post("/game", isLoggedIn, function(req, res){

		// var Table = require('../models/table.js');
	})	

	//PROFILE
	app.get("/profile", isLoggedIn, function(req, res){
		req.session.user = req.user;
		console.log(req.user);
		dataToTemplate.page = "profile";
		dataToTemplate.user = req.user;
		res.render('template', dataToTemplate );
	})

	
	// SIGNUP =================================
		// show the signup form
	app.get("/signup", function(req, res){
		res.render('template', {page:"sign_up", auth:req.isAuthenticated(), message: req.flash('loginMessage')} );
	})

	// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));
	
	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// 	// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// // twitter --------------------------------

	// 	// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

	// 	// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// // google ---------------------------------

	// 	// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

	// 	// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));
	
	// LOGIN ===============================
		// show the login form
	// app.get("/login", function(req, res){
	// 	res.render('template', {page:"sign_in", message: req.flash('loginMessage')} );
	// })
	
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));	

	// LOGOUT
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	// EDIT PROFILE ===============================
	
	app.post('/editProfile', function(req, res){
		
		var User       = require('../models/users');

		User.findById(req.user.id, function (err, user) {  
		 //  if (err) {
			// 	console.error(err); 
			// 	res.status(500); 
			// 	res.send(""); 
			// 	return;
			// } 
 			user.local.fname = req.body.fname;
 			user.local.lname = req.body.lname;
 			user.local.email = req.body.email;
 			// 
 			user.save(user.local); 	
 			// res.redirect('./profile');		 
		});

		if (!req.files) {
		    return res.status(400).send('No files were uploaded.');
		}
		  // The name of the input field (i.e. "userImg") is used to retrieve the uploaded file 
		var userImg = req.files.userImg;
		 
		  // Use the mv() method to place the file somewhere on your server 
		userImg.mv('./models/users-img/'+ req.user.id + '.jpg', function(err) {
		    if (err){
		 	   return res.status(500).send(err);
		    }
		 
		   res.send('File uploaded!');
		});

		res.redirect('./profile');
	});


	// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	//404
	app.use(function(req, res){
		dataToTemplate.page = "404";
		res.status(404);
		res.render('template', dataToTemplate );
	})

	//500
	app.use(function(err, req, res, next){
		if(err) console.log(err);
		dataToTemplate.page = "500";
		res.status(500);
		res.render('template', dataToTemplate );
	});


		// route middleware to ensure user is logged in
	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.redirect('/');
	}

}

module.exports = run;