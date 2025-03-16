const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const RefreshToken = require("../models/RefreshToken");

// Create User 
exports.signup = async (req, res) => {
  try {
    const { username, password ,role} = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        status: "Failed",
        message: "User already exists",
        error: {
          message: "User already exists",
        }
      });
    } 
    // Save user
    const newUser = new User({  username, password ,role});
    await newUser.save();
    res.status(201).json({ 
      status: "Success",
      message: "User registered successfully.",
       data: {
        user_id: newUser._id,
        username: newUser.username,
    }});
} catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      error: {
        message: "User registration failed",
      },
    });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email or mobile
    const user = await User.findOne({ $or: [{ username }] });

    if (!user) {
      return res.status(400).json({status:"failed", message: "User not found" , error: { message: "Invalid credentials" },
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({status: "Failed", message: "Invalid credentials", 
        error: { message: "Invalid credentials" }
      });
    }

    // Generate  accessToken & refreshToken
    const {accessToken,refreshToken} = user.generateAuthToken();
    const refreshTokenSave = new RefreshToken({
      token: refreshToken,
      userId: user._id,
      expiresAt: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    await refreshTokenSave.save();
    // Set token in HTTP-only cookie
   // Set cookie options based on environment (local or production)
   const isProduction = process.env.NODE_ENV === 'production';

   // Set accessToken in HTTP-only cookie
   res.cookie("accessToken", accessToken, {
     httpOnly: isProduction,
     secure: isProduction, // Use secure cookies only in production
     sameSite: isProduction ? 'None' : 'Lax', // 'Strict' for production, 'Lax' for localhost
     maxAge: 24 * 60 * 60 * 1000, // 1 day
   });

   // Set refreshToken in HTTP-only cookie
   res.cookie("refreshToken", refreshToken, {
     httpOnly: isProduction,
     secure: isProduction, // Use secure cookies only in production
     sameSite: isProduction ? 'None' : 'Lax', // 'Strict' for production, 'Lax' for localhost
     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
   });
   
    res.status(201).json({ 
      status: "Success",
      message: "User logged in successfully.",
       data: {
        user_id: user._id,
        username: user.username,
        accessToken:accessToken,
        refreshToken:refreshToken,
    }});  

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: error.message,
      error: { message: "User Login failed" }
    });
  }
};





