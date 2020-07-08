const http = require('http');
let counter = 0;

const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  counter++;
  res.write(`Номер запроса: ${counter}`);
  res.end();
});

server.listen(8080);