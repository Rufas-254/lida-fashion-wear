const Category = require('../models/Category');
const Product  = require('../models/Product');

// ─── GET /api/categories ──────────────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const filter = {};
    if (req.query.active !== 'false') filter.isActive = true;

    const categories = await Category.find(filter).sort({ displayOrder: 1, name: 1 });

    // Append product counts
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, isActive: true });
        return { ...cat.toObject(), productCount: count };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/categories/:id ─────────────────────────────────────────────────
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/categories (Admin) ────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, isFeatured, displayOrder } = req.body;

    if (!name) return res.status(400).json({ message: 'Category name is required' });

    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) return res.status(400).json({ message: 'Category with this name already exists' });

    const category = await Category.create({ name, description, imageUrl, isFeatured, displayOrder });
    res.status(201).json({ message: 'Category created', category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/categories/:id (Admin) ─────────────────────────────────────────
const updateCategory = async (req, res) => {
  try {
    const { name, description, imageUrl, isActive, isFeatured, displayOrder } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (name)                    category.name         = name;
    if (description !== undefined) category.description = description;
    if (imageUrl)                category.imageUrl     = imageUrl;
    if (isActive !== undefined)  category.isActive     = isActive;
    if (isFeatured !== undefined) category.isFeatured  = isFeatured;
    if (displayOrder !== undefined) category.displayOrder = displayOrder;

    const updated = await category.save();
    res.json({ message: 'Category updated', category: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/categories/:id (Admin) — Soft Delete ───────────────────────
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    category.isActive = false;
    await category.save();
    res.json({ message: 'Category deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
