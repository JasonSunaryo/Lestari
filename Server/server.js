require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const nodemailer = require("nodemailer");
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const session = require("express-session");
const app = express();
const passport = require('./config/passport');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/orders');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:8080', // Your Vue.js frontend URL
  credentials: true,
  methods: ['GET', 'POST','PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// Session middleware harus di atas passport middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
  
}))


app.post("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
});


// Passport middleware
app.use(passport.initialize());
app.use(passport.session())

app.post("/logout", function(req, res, next) {
  req.session.destroy(function(err) {
    if (err) {
      console.error("Session destruction error:", err);
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
});



app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/products', require('./routes/product'));



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.get('/auth/google',
  (req, res, next) => {
    console.log('Starting Google auth...');
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  }
);

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userRole === 'admin') {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

app.get('/api/check-session', (req, res) => {
  if (req.session && req.session.userRole) {
    res.json({
      userRole: req.session.userRole,
      isAuthenticated: true
    });
  } else {
    res.status(401).json({
      message: 'No active session',
      isAuthenticated: false
    });
  }
});

// Modified Google auth callback with admin role handling
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Get or set default role (you might want to check against a list of admin emails)
    const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
    const isUserAdmin = adminEmails.includes(req.user.email);
    const userRole = isUserAdmin ? 'admin' : 'customer';

    // Update user role in database
    User.findByIdAndUpdate(req.user._id, { role: userRole }, { new: true })
      .then(updatedUser => {
        // Set session
        req.session.userId = req.user._id;
        req.session.userRole = userRole;
        req.session.isAdmin = userRole === 'admin';

        // Set cookies
        res.cookie('user_session', req.sessionID, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Set shopping cart cookie if needed
        if (!req.cookies.cart_id) {
          res.cookie('cart_id', crypto.randomUUID(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
          });
        }

        // Prepare user data
        const userData = {
          id: req.user._id,
          email: req.user.email,
          name: req.user.name,
          imageUrl: req.user.picture,
          googleId: req.user.googleId,
          role: userRole
        };
        
        // Redirect with user data
        res.redirect(`${process.env.FRONTEND_URL}/auth/success?data=${encodeURIComponent(JSON.stringify(userData))}&forceRefresh=true`);
      })
      .catch(err => {
        console.error('Error updating user role:', err);
        res.redirect('/login');
      });
  }
);

// Function to generate verification code
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send verification email
async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verifikasi Akun Anda",
    html: `
        <h1>Verifikasi Akun</h1>
        <p>Gunakan kode berikut untuk memverifikasi akun Anda:</p>
        <h2>${code}</h2>
        <p>Kode ini akan kadaluarsa dalam 15 menit.</p>
      `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Routes
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log("Register request received:", { username, email });

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      // If user exists but not verified, generate new verification code
      if (!existingUser.isVerified) {
        const verificationCode = generateVerificationCode();
        const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        existingUser.verificationCode = verificationCode;
        existingUser.verificationCodeExpires = verificationCodeExpires;
        await existingUser.save();

        // Send new verification email
        await sendVerificationEmail(email, verificationCode);

        return res.status(200).json({
          message: "New verification code has been sent to your email",
        });
      }

      return res.status(400).json({
        message: "User already exists and is verified",
      });
    }

    // For new user registration
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = new User({
      username,
      email,
      password,
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    await user.save();
    await sendVerificationEmail(email, verificationCode);

    res.status(201).json({
      message: "Registration initiated. Please check your email for verification code.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});


app.post("/verify", async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Check if verification code is expired
    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    // Check verification code
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      message: "Error verifying email",
      error: error.message,
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: "Please verify your email before logging in" 
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Create session
    req.session.userId = user._id;
    req.session.userRole = user.role || 'customer';
    req.session.isAdmin = user.role === 'admin'; 

    // Set cookies
    res.cookie('user_session', req.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Set shopping cart cookie if needed
    if (!req.cookies.cart_id) {
      res.cookie('cart_id', crypto.randomUUID(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role || 'customer'
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error logging in",
      error: error.message
    });
  }
});

function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpires = resetTokenExpires;
    await user.save();

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: "Error sending reset link",
      error: error.message
    });
  }
});

app.post("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    console.log('Reset attempt with token:', token);
    console.log('Password received:', !!password); // logs true/false if password exists

    // Find user by reset token
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() }
    });

    console.log('User found:', !!user); // logs if user was found

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;

    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.messag
      
    });
  }
});


app.get('/products', isAdmin, (req, res) => {
  res.json({ message: "Welcome to admin dashboard" });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));