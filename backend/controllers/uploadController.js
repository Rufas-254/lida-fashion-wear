const { cloudinary } = require('../config/cloudinary');

// ─── POST /api/upload/image — Single image upload (Admin) ────────────────────
const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // If using multer-storage-cloudinary, the URL is already in req.file.path
    const imageUrl = req.file.path || req.file.secure_url;

    res.json({
      message: 'Image uploaded successfully',
      url:     imageUrl,
      publicId: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Image upload failed' });
  }
};

// ─── POST /api/upload/images — Multiple images (max 4) (Admin) ───────────────
const uploadImages = async (req, res) => {
  try {
    if (!req.files || !req.files.length) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const urls = req.files.map(file => file.path || file.secure_url);

    res.json({
      message: `${urls.length} image(s) uploaded successfully`,
      urls,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Images upload failed' });
  }
};

// ─── DELETE /api/upload/image — Delete image from Cloudinary (Admin) ─────────
const deleteImage = async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: 'Public ID is required' });

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted from Cloudinary' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Image deletion failed' });
  }
};

module.exports = { uploadImage, uploadImages, deleteImage };
