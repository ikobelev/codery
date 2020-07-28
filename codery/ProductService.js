const mongoClient = require('mongodb').MongoClient;

let shopDatabase;
let productCollection;

module.exports = {
  /**
   * Инициализирует список товаров
   */
  init(mongoUri) {
    mongoClient.connect(mongoUri)
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
    return new Promise((resove, reject) => {
      this.getProducts().then((products) => {
        const product = products.find((x) => x.baseName === baseName);
        resove(product);
      });
    });
  },

};
