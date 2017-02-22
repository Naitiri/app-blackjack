var server = require("http");

server.createServer(function(req,res){
	res.end("<p>I am server</p>");
}).listen(3000);