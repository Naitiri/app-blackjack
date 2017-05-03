module.exports = function (io, User, mongoose) {
	var Table = require("../models/table.js");
	require("./lobby")(io, Table, User);
	require("./table")(io, Table, User);
}