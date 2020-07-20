const products = [];

module.exports = {
  /**
   * Инициализирует список товаров
   */
  init() {
    products.push({
      title: 'ПВУ Turkov ZENIT 350 HECO',
      img: '/static/product1.png',
      description: 'Вентиляционная установка в легком корпусе',
      href: '/static/product1.html',
    });
    products.push({
      title: 'ПВУ Globalvent CLIMATE-R 300',
      img: '/static/product2.jpeg',
      description: 'Компактная и экономичная приточно-вытяжная вентиляционная установка',
      href: '/static/product2.html',
    });
  },

  /**
   * Возвращает список товаров
   */
  getProducts() {
    return products;
  },
};
