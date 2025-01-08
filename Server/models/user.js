const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Cart item sub-schema
const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Wishlist item sub-schema
const wishlistItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String },
    verificationCodeExpires: { type: Date },
    role: { type: String, default: "customer" },
    resetToken: { type: String },
    resetTokenExpires: { type: Date },
    wishlist: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.googleId) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Helper methods for cart management
userSchema.methods.addToCart = async function(productId, quantity) {
  const existingItem = this.cart.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (existingItem) {
    existingItem.quantity = quantity;
  } else {
    this.cart.push({ productId, quantity });
  }
  
  await this.save();
};

userSchema.methods.updateCartQuantity = async function(productId, quantity) {
  const item = this.cart.find(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (item) {
    item.quantity = quantity;
    await this.save();
  }
};

userSchema.methods.removeFromCart = async function(productId) {
  this.cart = this.cart.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  await this.save();
};

// Helper methods for wishlist management
userSchema.methods.addToWishlist = async function(productId) {
  const exists = this.wishlist.some(item => 
    item.productId.toString() === productId.toString()
  );
  
  if (!exists) {
    this.wishlist.push({ productId });
    await this.save();
  }
};

userSchema.methods.removeFromWishlist = async function(productId) {
  this.wishlist = this.wishlist.filter(item => 
    item.productId.toString() !== productId.toString()
  );
  await this.save();
};

const User = mongoose.model("User", userSchema);
module.exports = User;
