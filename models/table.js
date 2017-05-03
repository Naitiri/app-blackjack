var mongoose = require('mongoose');
var shuffle = require('shuffle-array');
var cardsArr = require('./cards');
	// define the schema for our user model
	var tableSchema = mongoose.Schema({

		cards : Object,
		players : [{
			player : {
				type : mongoose.Schema.Types.ObjectId,
				ref  : "User"
			},
			fullName : {
				type   	: String,
				default	: "Аноним"
			},
			bet : {
				type 	: Number,
				default : 0
			},
			setBet : {
				type 	: Boolean,
				default	: false
			},
			points : {
				type 	: Number,
				default : 0
			},
			soketId   : String,
			hand 	  : Array,
			balance   : Number,
			startGame : Boolean,
			isInGame  : Boolean
		}],
		dealer 	: {
			hand   : Array,
			points : {
				type 	: Number,
				default : 0
			}
		},
		isPlaying : {
			type 	: Boolean,
			default : false
		}

	});

	// create the model for users and expose it to our app

//Добавление пользователя
	tableSchema.methods.addPlayer = function(user, socketId) {
        var newPlayer = {
            player  : user._id,
            balance	: user.local.balance,
            socketId: socketId,
            isInGame: true 
        }

        if(user.local.fname || user.local.lname) {
			newPlayer.fullName = user.local.fname + " " + user.local.lname;
        }

        this.players.push(newPlayer);
    }

    tableSchema.statics.findActiveTables = function(callback) {
    	return this.find({ isPlaying : false }).$where('this.players.length < 5').exec(callback);
    }

	tableSchema.methods.startGame = function() {
		this.isPlaying = true;
	}
    

module.exports = mongoose.model('Table', tableSchema);
