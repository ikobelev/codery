const mongoClient = require('mongodb').MongoClient;

let shopDatabase;
let productCollection;

module.exports = {
  /**
   * Инициализирует список товаров
   */
  init(mongoUrl) {
    mongoClient.connect(mongoUrl)
      .then((clientInstance) => {
        shopDatabase = clientInstance.db('shop');
        productCollection = shopDatabase.collection('product');
      });
  },

  /**
   * Возвращает промис списка товаров
   */
  getProducts() {
    return new Promise((resolve, reject) => {
      const cursor = productCollection.find();
      cursor.toArray()
        .then((products) => {
          products.forEach((p) => {
            // добавляем поле идентификтора товара в формате {key}-{slug}
            this.postInitProduct(p);
          });
          resolve(products);
        });
    });
  },

  /**
   * Возвращает промис товара по ключу
   * @param {string} key ключ товара
   */
  getProductByKey(key) {
    return new Promise((resolve, reject) => {
      productCollection.findOne({ key })
        .then((product) => {
          // добавляем поле идентификтора товара в формате {key}-{slug}
          this.postInitProduct(product);
          resolve(product);
        });
    });
  },

  /**
   * Парсит идентификтор товара.
   * Возращает объект, содержащий ключ и slug товара
   * @param {string} идентификатор товара в формате {key}-{slug}
   */
  parseProductBaseName(baseName) {
    const key = baseName.split('-')[0];
    const slug = baseName.slice(key.length + 1);
    return { key, slug };
  },

  /**
   * Выполняет пост-инициализацию объекта товара:
   * добавляет идентификатор товара в формате {key}-{slug}
   * @param {*} product - объект товара
   */
  postInitProduct(product) {
    if (product) {
      product.baseName = `${product.key}-${product.slug}`;
    }
  },

};
