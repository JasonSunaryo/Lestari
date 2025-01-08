const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');



const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  res.status(401).json({ message: "Please sign in to continue" });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

router.get('/analytics', isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = {
      status: 'delivered' // Only count completed orders
    };
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: 1 });
    
    // Initialize analytics object
    const analytics = {
      totalRevenue: 0,
      totalOrders: orders.length,
      averageOrderValue: 0,
      productPerformance: {},
      dailyData: {}
    };
    
    // Process orders
    orders.forEach(order => {
      analytics.totalRevenue += order.totalAmount;
      
      const dateKey = new Date(order.createdAt).setHours(0,0,0,0);
      if (!analytics.dailyData[dateKey]) {
        analytics.dailyData[dateKey] = {
          date: dateKey,
          revenue: 0,
          orders: 0
        };
      }
      analytics.dailyData[dateKey].revenue += order.totalAmount;
      analytics.dailyData[dateKey].orders += 1;
      
      order.items.forEach(item => {
        const productId = item.product._id.toString();
        if (!analytics.productPerformance[productId]) {
          analytics.productPerformance[productId] = {
            id: productId,
            name: item.product.name,
            unitsSold: 0,
            revenue: 0
          };
        }
        analytics.productPerformance[productId].unitsSold += item.quantity;
        analytics.productPerformance[productId].revenue += item.price * item.quantity;
      });
    });
    
    analytics.averageOrderValue = orders.length > 0 
      ? analytics.totalRevenue / orders.length 
      : 0;
    
    // Convert dailyData object to sorted array
    analytics.dailyData = Object.values(analytics.dailyData)
      .sort((a, b) => a.date - b.date);
    
    // Convert productPerformance object to sorted array
    analytics.productPerformance = Object.values(analytics.productPerformance)
      .sort((a, b) => b.revenue - a.revenue);
    
    res.json(analytics);
  } catch (error) {
    console.error('Error generating analytics:', error);
    res.status(500).json({ 
      message: 'Error generating analytics data',
      error: error.message 
    });
  }
});

// Cloudinary configuration for payment proofs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Setup Cloudinary storage for payment proofs
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'payment-proofs',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    public_id: (req, file) => `payment_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
});


router.use(isAuthenticated);

// File filter for payment proofs
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

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

// Create order
router.post('/', isAuthenticated, upload.single('paymentProof'), handleMulterError, async (req, res) => {
  try {
    const {
      fullName,
      phoneNumber,
      streetAddress,
      district,
      city,
      province,
      postalCode,
      addressDetails,
      cart,
      totalAmount
    } = req.body;

    // Parse cart items
    const cartItems = JSON.parse(cart);

    // Validate stock availability and update product stock
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }
      
      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create new order
    const order = new Order({
      user: req.session.userId, // Add user reference
      customer: {
        fullName,
        phoneNumber,
        address: {
          street: streetAddress,
          district,
          city,
          province,
          postalCode,
          additionalDetails: addressDetails
        }
      },
      items: cartItems.map(item => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: parseFloat(totalAmount),
      paymentProof: req.file ? req.file.path : null,
      status: 'pending' // Initial status
    });

    const savedOrder = await order.save();

    // Populate product details in response
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('items.product', 'name images');

    res.status(201).json(populatedOrder);
  } catch (error) {
    // Delete uploaded payment proof if order creation fails
    if (req.file) {
      const publicId = `payment-proofs/${req.file.filename}`;
      await cloudinary.uploader.destroy(publicId);
    }
    res.status(400).json({ message: error.message });
  }
});

router.get('/admin', isAdmin, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('customer')
      .populate('items.product')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all orders (with optional filters)

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    let query = {
      user: req.session.userId
    };
    
    if (status) {
      query.status = status;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .populate('items.product')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    let query = { _id: req.params.id };
    
    if (!req.session.isAdmin) {
      query.user = req.session.userId;
    }

    const order = await Order.findOne(query)
      .populate('items.product', 'name images')
      .populate('user', 'email name');
      
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Update order status
router.patch('/:id/status', isAdmin, async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Order ID:', req.params.id);
    
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      console.log('Invalid status:', status);
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log('Order not found:', req.params.id);
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log('Current order status:', order.status);
    order.status = status;
    order.statusUpdatedAt = new Date();
    
    const updatedOrder = await order.save();
    console.log('Updated order status:', updatedOrder.status);
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete order (admin only)
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.paymentProof) {
      const publicId = `payment-proofs/${order.paymentProof.split('/').pop().split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    await order.deleteOne();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;