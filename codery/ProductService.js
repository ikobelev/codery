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
    return new Promise(((resolve, reject) => {
      const cursor = productCollection.find();
      cursor.toArray()
        .then((products) => {
          products.forEach((p) => {
            // добавляем поле идентификтора товара в формате {key}-{slug}
            p.baseName = `${p.key}-${p.slug}`;
          });
          resolve(products);
        });
    }));
  },

  /**
   * Возвращает промис товара по идентификатору
   * @param {string} baseName идентификатор товара в формате {key}-{slug}
   */
  getProductByBaseName(baseName) {
    // извлекаем ключ товара из идентификатора
    const key = baseName.split('-')[0];
    return productCollection.findOne({ key });
  },

};
