var express = require('express');
var app = express();

app.use(express.static(__dirname + '/app'));

app.listen(8030, function () {
	console.log("Listening on port 8030");
});