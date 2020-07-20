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
 * @param {ServerResponse} res объект ответа
 * @param {Number} statusCode код ответа
 * @param {string} textContent текстовый контент для вывода
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
 * @param {ServerResponse} res объект ответа сервера
 */
function serveNotFound(res) {
  sendContent(res, 404, 'Страница не найдена');
}

/**
 * Вывод статического контента
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} fileName название статического файла
 */
function serveStatic(res, fileName) {
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

/**
 * Вывод главной страницы через шаблонизатор
 * @param {ServerResponse} res объект ответа сервера
 */
function serveIndex(res) {
  // проверяем наличие шаблона
  const templatePath = 'templates/index.ejs';
  if (!fs.exists) {
    serveNotFound(res);
    return;
  }
  // выводим страницу на основе шаблона
  const template = ejs.compile(fs.readFileSync(templatePath).toString());
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.write(template({ products: productService.getProducts() }));
  res.end();
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  try {
    if (url.parse(req.url).pathname === '/') {
      // главная страница
      serveIndex(res);
    } else if (path.dirname(req.url) === '/static') {
      // статический контент
      const fileName = path.basename(req.url);
      serveStatic(res, fileName);
    } else {
      serveNotFound(res);
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
