const { Product, Category, ProductImage, ProductOption, ProductCategory } = require('../models');

const categorySeed = [
  { id: 1, name: 'Calçados', slug: 'calcados', use_in_menu: true },
  { id: 2, name: 'Acessórios', slug: 'acessorios', use_in_menu: true },
  { id: 3, name: 'Promoções', slug: 'promocoes', use_in_menu: false }
];

const productSeed = {
  enabled: true,
  name: 'Tênis Modelo 01',
  slug: 'tenis-modelo-01',
  use_in_menu: true,
  stock: 12,
  description: 'Tênis confortável para uso diário.',
  price: 129.9,
  price_with_discount: 99.9,
  category_ids: [1],
  images: [
    { path: '/uploads/tenis-01.png', enabled: true }
  ],
  options: [
    {
      title: 'Tamanho',
      shape: 'square',
      radius: 4,
      type: 'text',
      values: '36,37,38,39'
    }
  ]
};

module.exports = {
  categorySeed,
  productSeed,
  Product,
  Category,
  ProductImage,
  ProductOption,
  ProductCategory
};
