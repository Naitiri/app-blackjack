module.exports = function(io, Table, User) {
	
	var getCardsJson   = require('../models/cards.json');
	var Shuffle 	   = require('shuffle-array');

	io.on('connection', function (socket) {
	 	socket.on("startGame", function() {
	 		if(socket.request.session.table) {
	 			Table.findById(socket.request.session.table._id, function (req, table) {
	 				table.startGame();
					table.save(function () {
                        Table.findActiveTables(function (req, tables) {
                            io.sockets.in('lobby').emit("showTablesInLobby", tables);
                        });
                        acceptBets(socket);
                    });
	 			})
	 		}
	 	});	

	 	socket.on("countBet", function(data) {
	 		console.log(socket.request.session.user);
	 		var user = socket.request.session.user;
	 		user.local.bet = 0;
	 		user.local.bet += Number(data.chip);
	 		console.log(socket.request.session.table);

	 		if(socket.request.session.table) {
	 			Table.findById(socket.request.session.table._id, function (req, table) {
	 				table.save(function () {
                        Table.find('players', function (players) {
                            console.log(players);
                        });
                        acceptBets(socket);
                    });
	 			})
	 		}
	 	});	
	});



		// socket.on("countBet");

	function acceptBets(socket) {

		Table.findById(socket.request.session.table._id, function (req, table) {
			for (var i = 0; i < table.players.length; i++) {
				if(!table.players[i].setBet) {
					io.emit("countBetTime", table.players);
				}
			}
	 	})
	}

}

