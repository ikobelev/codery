// Параметры конфигурации сервера
const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

/**
 * Вывод статического контента
 */
function serveStatic(req, res, customFileName) {
  const filename = customFileName || path.basename(req.url);
  const extension = path.extname(filename);

  switch (extension) {
    case '.html':
      res.setHeader('Content-Type', 'text/html;charset=utf-8');
      break;
    case '.css':
      res.setHeader('Content-Type', 'text/css');
      break;
    case '.png':
      res.setHeader('Content-Type', 'image/png');
      break;
    default:
  }
  const content = fs.readFileSync(`static/${filename}`);
  res.statusCode = 200;
  res.write(content);
  res.end();
}

/**
 * Вывод страницы 404
 */
function serveNotFound(res) {
  res.statusCode = 404;
  res.end();
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  if (url.parse(req.url).pathname === '/') {
    serveStatic(req, res, 'index.html');
  } else if (path.dirname(req.url) === '/static') {
    serveStatic(req, res);
  } else {
    serveNotFound(res);
  }
});

// Запуск сервера
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
