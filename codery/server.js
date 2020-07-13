// server config params
const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const url = require("url");
let counter = 0;

const server = http.createServer(function (req, res) {
  switch(url.parse(req.url).pathname) {
    case "/":
      serveIndex(res);
      break;
    case "/reset":
      serveReset(res)
      break;
    case "/counter":
      serveCounter(res)
      break;
    default:
      serveNotFound(res);
  }
});

function serveIndex(res) {
  initResponse(res);
  counter++;
  const html =  "<ul>" +
                "<li><a href=\"/counter\"/>Счетчик</li>" +
                "<li><a href=\"/reset\"/>Сброс</li>" +
                "</ul>";
  res.write(html);
  res.end();
}

function serveCounter(res) {
  initResponse(res);
  res.write(`Значение счетчика: ${counter}`);
  res.end();
}

function serveReset(res) {
  initResponse(res);
  counter = 0;
  res.write("Счетчик сброшен");
  res.end();
}

function serveNotFound(res) {
  initResponse(res);
  res.write("Not found");
  res.end();
}

function initResponse(res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html;charset=utf-8");
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`)
});