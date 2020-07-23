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
      key: '1',
      slug: 'pvu-turkov-zenit-350-heco',
      info: `Вентиляционная установка с рекуперацией тепла и влаги в легком и универсальном корпусе 
      из вспененного полипропилена предназначена для поддержания климата в жилых помещениях 
      или небольших офисах, магазинах`,

    });
    products.push({
      title: 'ПВУ Globalvent CLIMATE-R 300',
      img: '/static/product2.jpeg',
      description: 'Компактная и экономичная приточно-вытяжная вентиляционная установка',
      href: '/static/product2.html',
      key: '2',
      slug: 'pvu-globalvent-climate-r-300',
      info: `Компактная и экономичная приточно-вытяжная вентиляционная
      установка, используемая для поддержания в помещении свежей атмосферы. Зимой во время работы 
      отопительной системы агрегат обеспечивает нагрев подаваемого вовнутрь помещения воздуха. 
      Установка может монтироваться за подвесным потолком либо в отдельной нише, 
      то есть из помещения агрегат совершенно не виден.`,
    });

    // генерируем url по шаблону {key}-{slug}
    for (let i = 0; i < products.length; i += 1) {
      const p = products[i];
      p.url = `${p.key}-${p.slug}`;
    }
  },

  /**
   * Возвращает список товаров
   */
  getProducts() {
    return products;
  },

  /**
   * Возвращает товар по ключу
   * @param {string} key ключ товара
   */
  getProductByKey(key) {
    return products.find((product) => product.key === key);
  },
};
