const Product  = require('../models/Product');
const Category = require('../models/Category');

const PAGE_SIZE = 10;

// ─── GET /api/products ────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const {
      category, featured, bestseller, search,
      minPrice, maxPrice, size, color,
      sort = 'newest', page = 1, limit = PAGE_SIZE,
      admin // if admin=true, include inactive
    } = req.query;

    const filter = {};
    if (admin !== 'true') filter.isActive = true;

    // Category filter (by name or ObjectId)
    if (category) {
      const catDoc = await Category.findOne({
        name: { $regex: new RegExp(`^${category}$`, 'i') }
      });
      if (catDoc) filter.category = catDoc._id;
    }

    if (featured === 'true')    filter.isFeatured   = true;
    if (bestseller === 'true')  filter.isBestseller = true;

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Size filter
    if (size) filter.sizes = { $in: [size] };

    // Color filter
    if (color) filter.colors = { $in: [new RegExp(color, 'i')] };

    // Text search
    if (search) {
      filter.$or = [
        { name:        { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc')  sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'bestseller') sortOption = { isBestseller: -1, createdAt: -1 };

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page:       pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/jerseys ────────────────────────────────────────────────
const getJerseys = async (req, res) => {
  try {
    const jerseyCategory = await Category.findOne({
      name: { $regex: /^jerseys?$/i }
    });

    const filter = {
      isActive: true,
      ...(jerseyCategory ? { category: jerseyCategory._id } : { isBestseller: true }),
    };

    const { page = 1, limit = PAGE_SIZE } = req.query;
    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));
    const skip     = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({ products, page: pageNum, totalPages: Math.ceil(total / limitNum), total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name imageUrl');
    if (!product || (!product.isActive && req.query.admin !== 'true')) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id/related ───────────────────────────────────────────
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const related = await Product.find({
      category: product.category,
      _id:      { $ne: product._id },
      isActive: true,
    })
      .populate('category', 'name')
      .limit(4);

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products (Admin) ───────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, description, category, price, sizes, colors, images, stock, isFeatured, isBestseller } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ message: 'Name, category, and price are required' });
    }

    const product = await Product.create({
      name, description, category, price,
      sizes:       Array.isArray(sizes)  ? sizes  : sizes?.split(',').map(s => s.trim()) || [],
      colors:      Array.isArray(colors) ? colors : colors?.split(',').map(c => c.trim()) || [],
      images:      Array.isArray(images) ? images.slice(0, 4) : [],
      stock:       stock || 0,
      isFeatured:  isFeatured  === true || isFeatured  === 'true',
      isBestseller: isBestseller === true || isBestseller === 'true',
    });

    const populated = await product.populate('category', 'name');
    res.status(201).json({ message: 'Product created', product: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/products/:id (Admin) ────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['name', 'description', 'category', 'price', 'stock', 'isFeatured', 'isBestseller', 'isActive'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    if (req.body.sizes)  product.sizes  = Array.isArray(req.body.sizes)  ? req.body.sizes  : req.body.sizes.split(',').map(s => s.trim());
    if (req.body.colors) product.colors = Array.isArray(req.body.colors) ? req.body.colors : req.body.colors.split(',').map(c => c.trim());
    if (req.body.images) product.images = Array.isArray(req.body.images) ? req.body.images.slice(0, 4) : [];

    const updated = await product.save();
    await updated.populate('category', 'name');
    res.json({ message: 'Product updated', product: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/products/:id (Admin) — Soft Delete ──────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts, getJerseys, getProductById, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
};
