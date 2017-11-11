const http = require('http');

http.createServer(function (req, res){
	res.writeHead(200);
	res.write("Hello, KEMING.ZHANG!!!");
	res.end();

}).listen(3000);

