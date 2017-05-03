//socket
var socket = io();

    $("#add-table").on("click", function() {
        socket.emit("addNewTable", socket.id);
    });

    $("#tables-list").on("click", ".tables", joinTable);

    function joinTable() {
        socket.emit("joinTable", {tableId : $(this).attr('data-id')});
    }

    $("#start-game").on("click", function(){
        socket.emit("startGame", socket.id);
        $("#start-game").css("display", "none");
    });

     $(".chips>div").on("click", function() {
            var chip = $(this).attr("data-value");

            socket.emit("countBet", {soketId : socket.id, chip});
    })

//Показать игру в лобби
    socket.on("showTablesInLobby", function(data) {

        var tables = "",
            text;

        $.each(data, function(id, value){
            
            if(value.players.length == 1) {
            text = ' игрок';
            } else {
            text = ' игрока'};
        
            tables += '<li class="tables" data-id="' + value._id +'">' + "Стол (" + value.players.length + text + '. Организатор ' + value.players[0].fullName + ')</li></br>';
        })
        
        $("#tables-list").html(tables);
    });

//Отобразить игру
    socket.on("showGame", function(data) {
        
        $("#game-lobby").css("display", "none");
        $("#table-page").css("display", "block");

        if(data[0]) {
            $("#start-game").css("display", "block");
        }
    });

//Отобразить пользователей за столом
    socket.on("playersList", function(data) {
    
        var playersList = "";
        $.each(data, function(numb, value){
            var player = $("#player-" + (numb+1));
            
            if(value.isInGame) {
                player.children(".player-bet").html(value.bet);
                player.children(".player-points").html(value.points);
                player.children(".player-hand").html(value.hand);
                player.children(".player-name").html(value.fullName);
            } else {
                player.children(".player-name").html("Не в игре");
            }         
        })
    });

//Ставки
    socket.on("countBetTime", function(players) {
    
          var i = 30;
        
        function timer() {
            $(".set-bet span").html(i);
            i--;
        }; 
        
        setInterval(timer, 1000);
        if (i == 0) clearInterval(timer);
      
        $.each(players, function(numb, value){
            if(value.setBet) {clearInterval(timer)}
         
        
 })

       
    })

    //Показать баланс
    socket.on("getBalance", function(data) {
        $(".player-balance").children("span").html(data.userBalance);
    });


    // ==========CHAT=============

   $("#sendMessageToServer").on("click", function () {
        socket.emit("sendToChat", { userMessage : $("#userMessage").val(), userId : socket.id });
        $("#userMessage").val('');
    });

    socket.on("addToChat", function (data) {
        var userMessage = '<li>' + data.user + ' : ' + data.message + '</li>';
        $("#chatField").append(userMessage);
    });