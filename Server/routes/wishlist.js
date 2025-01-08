
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get wishlist items
router.get('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.session.userId)
      .populate('wishlist.productId', 'name price image');

    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
});

// Add to wishlist
router.post('/add', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { productId } = req.body;
    const user = await User.findById(req.session.userId);
    await user.addToWishlist(productId);

    const updatedUser = await User.findById(req.session.userId)
      .populate('wishlist.productId', 'name price image');

    res.json(updatedUser.wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const user = await User.findById(req.session.userId);
    await user.removeFromWishlist(req.params.productId);

    res.json({ message: 'Item removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
});

module.exports = router;