const { Product, ProductImage, ProductOption, ProductCategory, Category } = require('../models');

const getProducts = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      price_range,
      option
    } = req.query;

    const where = {};

    if (match) {
      where[require('sequelize').Op.or] = [
        { name: { [require('sequelize').Op.like]: `%${match}%` } },
        { description: { [require('sequelize').Op.like]: `%${match}%` } }
      ];
    }

    if (price_range) {
      const [min, max] = price_range.split('-').map(Number);
      where.price = {
        [require('sequelize').Op.gte]: min,
        [require('sequelize').Op.lte]: max
      };
    }

    const selectedFields = fields ? fields.split(',') : ['id', 'enabled', 'name', 'slug', 'stock', 'description', 'price', 'price_with_discount'];

    const total = await Product.count({ where });

    const products = await Product.findAll({
      where,
      attributes: selectedFields,
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'path', 'enabled']
        },
        {
          model: ProductOption,
          as: 'options',
          attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
        }
      ],
      limit: limit === '-1' ? undefined : Number(limit),
      offset: limit === '-1' ? 0 : (Number(page) - 1) * Number(limit),
      order: [['id', 'ASC']]
    });

    let filteredProducts = products;

    if (category_ids) {
      const ids = category_ids.split(',').map(Number);
      filteredProducts = products.filter((product) => {
        const productCategoryIds = product.Categories.map((category) => category.id);
        return ids.some((id) => productCategoryIds.includes(id));
      });
    }

    if (option) {
      const optionKey = Object.keys(req.query).find((key) => key.startsWith('option['));
      if (optionKey) {
        const optionId = Number(optionKey.match(/\d+/)?.[0]);
        const optionValue = req.query[optionKey];

        filteredProducts = filteredProducts.filter((product) => {
          const optionMatch = product.options?.find((item) => item.id === optionId);
          if (!optionMatch) return false;
          return optionMatch.values.includes(optionValue);
        });
      }
    }

    return res.status(200).json({
      data: filteredProducts,
      total: filteredProducts.length,
      limit: limit === '-1' ? -1 : Number(limit),
      page: Number(page)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar produtos.', error: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          through: { attributes: [] },
          attributes: ['id', 'name', 'slug']
        },
        {
          model: ProductImage,
          as: 'images',
          attributes: ['id', 'path', 'enabled']
        },
        {
          model: ProductOption,
          as: 'options',
          attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar produto.', error: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const {
      enabled,
      name,
      slug,
      use_in_menu,
      stock,
      description,
      price,
      price_with_discount,
      category_ids,
      images,
      options
    } = req.body;

    if (!name || !slug || !price || !price_with_discount) {
      return res.status(400).json({ message: 'Nome, slug, preço e preço com desconto são obrigatórios.' });
    }

    const productExists = await Product.findOne({ where: { slug } });
    if (productExists) {
      return res.status(400).json({ message: 'Produto já cadastrado.' });
    }

    const product = await Product.create({
      enabled: enabled || false,
      name,
      slug,
      use_in_menu: use_in_menu || false,
      stock: stock || 0,
      description,
      price,
      price_with_discount
    });

    if (category_ids && category_ids.length) {
      const relations = category_ids.map((categoryId) => ({
        product_id: product.id,
        category_id: categoryId
      }));

      await ProductCategory.bulkCreate(relations);
    }

    if (images && images.length) {
      const imageRecords = images.map((image) => ({
        product_id: product.id,
        enabled: image.enabled || false,
        path: image.path
      }));

      await ProductImage.bulkCreate(imageRecords);
    }

    if (options && options.length) {
      const optionRecords = options.map((option) => ({
        product_id: product.id,
        title: option.title,
        shape: option.shape || 'square',
        radius: option.radius || 0,
        type: option.type || 'text',
        values: Array.isArray(option.values) ? option.values.join(',') : option.values
      }));

      await ProductOption.bulkCreate(optionRecords);
    }

    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar produto.', error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await product.update({
      enabled: req.body.enabled !== undefined ? req.body.enabled : product.enabled,
      name: req.body.name || product.name,
      slug: req.body.slug || product.slug,
      use_in_menu: req.body.use_in_menu !== undefined ? req.body.use_in_menu : product.use_in_menu,
      stock: req.body.stock !== undefined ? req.body.stock : product.stock,
      description: req.body.description !== undefined ? req.body.description : product.description,
      price: req.body.price || product.price,
      price_with_discount: req.body.price_with_discount || product.price_with_discount
    });

    if (req.body.category_ids) {
      await ProductCategory.destroy({ where: { product_id: id } });
      await ProductCategory.bulkCreate(
        req.body.category_ids.map((categoryId) => ({
          product_id: id,
          category_id: categoryId
        }))
      );
    }

    if (req.body.images) {
      const imagesToCreate = req.body.images.filter((image) => !image.id && image.path);
      const imagesToDelete = req.body.images.filter((image) => image.id && image.deleted);
      const imagesToUpdate = req.body.images.filter((image) => image.id && !image.deleted && image.path);

      if (imagesToDelete.length) {
        await ProductImage.destroy({ where: { id: imagesToDelete.map((image) => image.id) } });
      }

      if (imagesToCreate.length) {
        await ProductImage.bulkCreate(imagesToCreate.map((image) => ({
          product_id: id,
          enabled: image.enabled || false,
          path: image.path
        })));
      }

      for (const image of imagesToUpdate) {
        await ProductImage.update({
          path: image.path,
          enabled: image.enabled || false
        }, { where: { id: image.id } });
      }
    }

    if (req.body.options) {
      const optionsToDelete = req.body.options.filter((option) => option.id && option.deleted);
      const optionsToCreate = req.body.options.filter((option) => !option.id && option.title);
      const optionsToUpdate = req.body.options.filter((option) => option.id && !option.deleted && option.title);

      if (optionsToDelete.length) {
        await ProductOption.destroy({ where: { id: optionsToDelete.map((option) => option.id) } });
      }

      if (optionsToCreate.length) {
        await ProductOption.bulkCreate(optionsToCreate.map((option) => ({
          product_id: id,
          title: option.title,
          shape: option.shape || 'square',
          radius: option.radius || 0,
          type: option.type || 'text',
          values: Array.isArray(option.values) ? option.values.join(',') : option.values
        })));
      }

      for (const option of optionsToUpdate) {
        await ProductOption.update({
          title: option.title,
          shape: option.shape || 'square',
          radius: option.radius || 0,
          type: option.type || 'text',
          values: Array.isArray(option.values) ? option.values.join(',') : option.values
        }, { where: { id: option.id } });
      }
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar produto.', error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado.' });
    }

    await ProductCategory.destroy({ where: { product_id: id } });
    await ProductImage.destroy({ where: { product_id: id } });
    await ProductOption.destroy({ where: { product_id: id } });
    await product.destroy();

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir produto.', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
