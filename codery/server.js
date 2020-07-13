// Параметры конфигурации сервера
const hostname = '127.0.0.1';
const port = 3000;
const urlReset = '/reset';
const urlCounter = '/counter';

const http = require('http');
const url = require('url');

let counter = 0;

/**
 * Вспомогательный метод инициализации ответа
 */
function initResponse(res, statusCode) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
}

/**
 * Главная страница
 */
function serveIndex(res) {
  initResponse(res, 200);
  counter += 1;
  const html = '<ul>'
    + `<li><a href="${urlCounter}">Счетчик</li>`
    + `<li><a href="${urlReset}"/>Сброс</li>`
    + '</ul>';
  res.write(html);
  res.end();
}

/**
 * Вывод страницы со счетчиком
 */
function serveCounter(res) {
  initResponse(res, 200);
  res.write(`Значение счетчика: ${counter}`);
  res.end();
}

/**
 * Сброс счетчика
 */
function serveReset(res) {
  initResponse(res, 200);
  counter = 0;
  res.write('Счетчик сброшен');
  res.end();
}

/**
 * Вывод страницы 404
 */
function serveNotFound(res) {
  initResponse(res, 404);
  res.write('Not found');
  res.end();
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  switch (url.parse(req.url).pathname) {
    case '/':
      serveIndex(res);
      break;
    case urlReset:
      serveReset(res);
      break;
    case urlCounter:
      serveCounter(res);
      break;
    default:
      serveNotFound(res);
  }
});

// Запуск сервера
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
