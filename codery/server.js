// Параметры конфигурации сервера
const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');
const ejs = require('ejs');
const productService = require('./ProductService.js');

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
function serveStatic(req, res, dirName, fileName) {
  // проверяем наличие файла
  const filePath = `${dirName}/${fileName}`;
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

/**
 * Вывод главной страницы через шаблонизатор
 */
function serveIndex(res) {
  const template = ejs.compile(fs.readFileSync('static/index.html').toString());
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.write(template({ products: productService.getProducts() }));
  res.end();
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  try {
    if (['/', '/static/index.html'].includes(url.parse(req.url).pathname)) {
      // главная страница
      serveIndex(res);
    } else {
      // остальной контент
      const dirName = path.dirname(req.url).slice(1);
      const fileName = path.basename(req.url);
      serveStatic(req, res, dirName, fileName);
    }
  } catch (e) {
    // что-то пошло не так
    console.log(`Ошибка при обработке запроса: ${e}`);
    sendContent(res, 500, 'Что-то пошло не так');
  }
});

// Инициализация подключаемых сервисов
productService.init();

// Запуск сервера
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
