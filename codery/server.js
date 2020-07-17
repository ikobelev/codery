// Параметры конфигурации сервера
const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

/**
 * Вспомогательная функция вывода заданного текстового контента
 */
function sendContent(res, statusCode, textContent) {
  res.statusCode = statusCode;
  if (textContent) {
    res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    res.write(textContent);
  }
  res.end();
}

/**
 * Вывод страницы 404
 */
function serveNotFound(res) {
  sendContent(res, 404, 'Страница не найдена');
}

/**
 * Вывод статического контента
 */
function serveStatic(req, res, customFileName) {
  const fileName = customFileName || path.basename(req.url);

  // проверяем наличие файла
  const filePath = `static/${fileName}`;
  if (!fs.existsSync(filePath)) {
    serveNotFound(res);
    return;
  }

  // выдаем контент файла
  switch (path.extname(fileName)) {
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
  // читаем и выдаем контент файла в потоке
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  try {
    if (url.parse(req.url).pathname === '/') {
      serveStatic(req, res, 'index.html');
    } else if (path.dirname(req.url) === '/static') {
      serveStatic(req, res);
    } else {
      serveNotFound(res);
    }
  } catch (e) {
    // что-то пошло не так
    console.log(`Ошибка при обработке запроса: ${e}`);
    sendContent(res, 500, 'Что-то пошло не так');
  }
});

// Запуск сервера
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
