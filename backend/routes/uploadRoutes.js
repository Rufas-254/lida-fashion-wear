const express = require('express');
const router  = express.Router();
const { uploadImage, uploadImages, deleteImage } = require('../controllers/uploadController');
const { adminProtect } = require('../middleware/adminMiddleware');
const { upload }       = require('../config/cloudinary');

// Single image upload
router.post('/image',  adminProtect, upload.single('image'),   uploadImage);

// Multiple images (max 4)
router.post('/images', adminProtect, upload.array('images', 4), uploadImages);

// Delete image from Cloudinary
router.delete('/image', adminProtect, deleteImage);

module.exports = router;
