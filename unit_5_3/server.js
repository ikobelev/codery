const http = require('http');
let counter = 0;

const server = http.createServer(function(req, res) {
  console.log("Request, url:", req.url);
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain;charset=utf-8");
  if (req.url!="/favicon.ico") {
    counter++;
  }
  res.write(`Номер запроса: ${counter}`);
  res.end();
});

server.listen(8080);