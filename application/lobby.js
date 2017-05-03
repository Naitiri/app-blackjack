module.exports = function(io, Table, User) {
	
	var getCardsJson   = require('../models/cards.json');
	var Shuffle 	   = require('shuffle-array');

	

	io.on('connection', function (socket) {

	console.log('connected!');
	
	socket.join('lobby');
	showActiveTables();

	socket.on("addNewTable", function(data) { 
    	
    	var table = new Table();
    	var userId = socket.request.session.user._id;
		var room = 'table-' + table._id;
		User.findById(userId, function (req, user) {	    
		    // console.log(table._id);

		    table.addPlayer(user, socket.id);
		    table.save(function(){
		    	socket.request.session.table = table;
				socket.leave('lobby');
				socket.join(room);
		        socket.emit("showGame", table.players);
		        io.emit("playersList", table.players);
		        socket.emit("getBalance", { userBalance : user.local.balance});
		        showActiveTables(); 
	    	}).then();
	    	// console.log(table);

		});
    });

	socket.on("joinTable", function(data) {
    	if (socket.request.session.user) {
                var userId = socket.request.session.user._id;
                
                Table.findById(data.tableId, function (req, table) {
                    if (table) {
                    	var room = 'table-' + table._id;
                        socket.request.session.table = table;
                        socket.leave('lobby');
                        socket.join(room);
                        User.findById(userId, function (req, user) {
                            table.addPlayer(user, socket.id);
                            table.save(function () {
                               socket.emit("showGame", user);
        						io.emit("playersList", table.players);
        						socket.emit("getBalance", { userBalance : user.local.balance});

        						showActiveTables();
                            }); 
                        });
                    }
                });
            }  
       
    });

  
// ==========CHAT=============
  	 	socket.on("sendToChat", function (data) {
	        io.emit("addToChat", {user : user.local.fname, message : data.userMessage})
	    });
	  
	  socket.on('disconnected', function (data) {
	    console.log("disconnected");  
	  });
	});

	function showActiveTables() {
        Table.findActiveTables(function (req, tables) {
            io.sockets.in('lobby').emit("showTablesInLobby", tables);
            // console.log(tables);
        });
    }
} 
