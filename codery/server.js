// Параметры конфигурации сервера
const hostname = '127.0.0.1';
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';

const http = require('http');
const path = require('path');
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
 * Вспомогательная функция вывода страницы через шаблонизатор
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} templatePath путь файла шаблона
 * @param {any} scope контент для вывода
 * @param {number} statucCode код ответа
 */
function serveTemplate(res, templatePath, scope, statusCode) {
  // проверяем наличие шаблона
  if (!fs.existsSync(templatePath)) {
    sendContent(res, 404, 'Шаблон не найден');
    return;
  }
  // выводим страницу на основе шаблона
  const template = ejs.compile(fs.readFileSync(templatePath).toString());
  res.statusCode = statusCode || 200;
  res.setHeader('Content-Type', 'text/html;charset=utf-8');
  res.write(template(scope));
  res.end();
}

/**
 * Вывод страницы 404
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} customText текстовый контент для вывода
 */
function serveNotFound(res, customText) {
  const scope = {
    textContent: customText || 'Введенная вами страница на сайте не обнаружена',
  };
  serveTemplate(res, 'templates/404.ejs', scope, 404);
}

/**
 * Вывод статического контента
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} fileName название статического файла
 */
function serveStatic(res, fileName) {
  // проверяем наличие файла
  const filePath = `public/${fileName}`;
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
  const templatePath = 'templates/index.ejs';
  productService.getProducts()
    .then((products) => {
      serveTemplate(res, templatePath, { products });
    });
}

/**
 * Выполняет редирект на указанную страницу
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} targetUrl целевая страница перенаправления
 */
function redirectTo(res, targetUrl) {
  res.statusCode = 301;
  res.setHeader('Location', targetUrl);
  res.end();
}

/**
 * Вывод страницы с товаром
 * @param {ServerResponse} res объект ответа сервера
 * @param {string} baseName идентификтор товара (key+slug)
 */
function serveProduct(res, baseName) {
  const templatePath = 'templates/product.ejs';
  const parsedId = productService.parseProductBaseName(baseName);
  productService.getProductByKey(parsedId.key)
    .then((product) => {
      if (!product) {
        // товар по ключу не найден
        serveNotFound(res, 'Введенный вами товар не найден');
      } else if (product.baseName !== baseName) {
        // товар по ключу найден, но идентификатор (key+slug) не совпадает
        redirectTo(res, `/product/${product.baseName}`);
      } else {
        serveTemplate(res, templatePath, { product });
      }
    });
}

// Роутинг запроса
const server = http.createServer((req, res) => {
  try {
    const dirName = path.dirname(req.url);
    const baseName = path.basename(req.url);
    if (req.url === '/') {
      // главная страница
      serveIndex(res);
    } else if (dirName === '/static') {
      // статический контент
      serveStatic(res, baseName);
    } else if (dirName === '/product') {
      //  информация о товаре
      serveProduct(res, baseName);
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
productService.init(mongoUrl);

// Запуск сервера
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
});
