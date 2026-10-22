const { Category } = require('../models');

const getCategories = async (req, res) => {
  try {
    const { limit = 12, page = 1, use_in_menu, fields } = req.query;

    const where = {};
    if (use_in_menu !== undefined) {
      where.use_in_menu = use_in_menu === 'true';
    }

    const selectedFields = fields ? fields.split(',') : ['id', 'name', 'slug', 'use_in_menu'];

    const total = await Category.count({ where });

    const data = await Category.findAll({
      where,
      attributes: selectedFields,
      limit: limit === '-1' ? undefined : Number(limit),
      offset: limit === '-1' ? 0 : (Number(page) - 1) * Number(limit),
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      data,
      total,
      limit: limit === '-1' ? -1 : Number(limit),
      page: Number(page)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao listar categorias.', error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao buscar categoria.', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, slug, use_in_menu } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: 'Nome e slug são obrigatórios.' });
    }

    const categoryExists = await Category.findOne({ where: { slug } });
    if (categoryExists) {
      return res.status(400).json({ message: 'Categoria já cadastrada.' });
    }

    const category = await Category.create({
      name,
      slug,
      use_in_menu: use_in_menu || false
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao criar categoria.', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, use_in_menu } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    await category.update({
      name: name || category.name,
      slug: slug || category.slug,
      use_in_menu: use_in_menu !== undefined ? use_in_menu : category.use_in_menu
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao atualizar categoria.', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    await category.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Erro ao excluir categoria.', error: error.message });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
