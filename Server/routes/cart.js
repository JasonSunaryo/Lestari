const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get cart items
router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.session.userId)
      .populate('cart.productId', 'name price image stock'); // Populate product details

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
});

// Add/Update cart item
router.post('/add', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId, quantity } = req.body;
    const user = await User.findById(req.session.userId);
    await user.addToCart(productId, quantity);

    const updatedUser = await User.findById(req.session.userId)
      .populate('cart.productId', 'name price image stock');

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// Update quantity
router.put('/update-quantity', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId, quantity } = req.body;
    const user = await User.findById(req.session.userId);
    await user.updateCartQuantity(productId, quantity);

    const updatedUser = await User.findById(req.session.userId)
      .populate('cart.productId', 'name price image stock');

    res.json(updatedUser.cart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating quantity', error: error.message });
  }
});

// Remove from cart
router.delete('/remove/:productId', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.session.userId);
    await user.removeFromCart(req.params.productId);

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
});

module.exports = router;