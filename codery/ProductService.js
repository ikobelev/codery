const products = [];

module.exports = {
  init() {
    products.push({
      title: 'ПВУ Turkov ZENIT 350 HECO',
      img: '/product/product1.png',
      description: 'Вентиляционная установка в легком корпусе',
      href: '/product/product1.html',
    });
    products.push({
      title: 'ПВУ Globalvent CLIMATE-R 300',
      img: '/product/product2.jpeg',
      description: 'Компактная и экономичная приточно-вытяжная вентиляционная установка',
      href: '/product/product2.html',
    });
  },

  getProducts() {
    return products;
  },
};
