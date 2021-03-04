var http = require('http');

http.createServer(function (req, res) {
  res.write("ok");
  res.end();
}).listen(8080);