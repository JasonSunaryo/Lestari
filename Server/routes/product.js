const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (url) => {
  const splittedUrl = url.split('/');
  const publicIdWithExtension = splittedUrl[splittedUrl.length - 1];
  return publicIdWithExtension.split('.')[0];
};

// Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    public_id: (req, file) => `product_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', upload.array('images', 5), handleMulterError, async (req, res) => {
  try {
    const imageUrls = req.files.map(file => file.path);
    
    const product = new Product({
      name: req.body.name,
      costPrice: req.body.costPrice,
      sellingPrice: req.body.sellingPrice,
      category: req.body.category,
      stock: req.body.stock,
      description: req.body.description,
      images: imageUrls
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    // Delete uploaded images if product creation fails
    if (req.files) {
      for (const file of req.files) {
        const publicId = `products/${getPublicIdFromUrl(file.path)}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', upload.array('images', 5), handleMulterError, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Update basic fields
    const updateFields = ['name', 'costPrice', 'sellingPrice', 'category', 'stock', 'description'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });
    
    // Dapatkan array gambar yang tetap dipertahankan
    const remainingImages = JSON.parse(req.body.remainingImages || '[]');
    
    // Hapus gambar yang tidak ada di remainingImages dari Cloudinary
    for (const imageUrl of product.images) {
      if (!remainingImages.includes(imageUrl)) {
        const publicId = `products/${getPublicIdFromUrl(imageUrl)}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }
    
    // Set gambar yang tersisa
    product.images = remainingImages;
    
    // Tambahkan gambar baru jika ada
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      product.images = [...product.images, ...newImageUrls];
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    // Delete newly uploaded images if update fails
    if (req.files) {
      for (const file of req.files) {
        const publicId = `products/${getPublicIdFromUrl(file.path)}`;
        await cloudinary.uploader.destroy(publicId);
      }
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete specific image from product
router.delete('/:id/images/:imageIndex', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex >= 0 && imageIndex < product.images.length) {
      const imageUrl = product.images[imageIndex];
      const publicId = `products/${getPublicIdFromUrl(imageUrl)}`;
      
      await cloudinary.uploader.destroy(publicId);
      product.images.splice(imageIndex, 1);
      await product.save();
      res.json(product);
    } else {
      res.status(400).json({ message: 'Invalid image index' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    // Delete all images from Cloudinary
    for (const imageUrl of product.images) {
      const publicId = `products/${getPublicIdFromUrl(imageUrl)}`;
      await cloudinary.uploader.destroy(publicId);
    }
    
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;