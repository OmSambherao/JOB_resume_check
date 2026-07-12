const userModel = require("../models/user.model");
const tokenBlackListModel = require("../models/blacklist.model");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get } = require("mongoose");

/**
 *
 * @register user
 * @description register user and send data user data in response
 */
async function registerUserController(req, res) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Please provide username, email, and password.",
      });
    }

    const isUserAlreadyExist = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserAlreadyExist) {
      return res.status(400).json({
        message: "Username or email already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      username,
      email,
      password: hash,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust sameSite for production
      maxAge: 24 * 60 * 60 * 1000,
    };

    // Secure cross-domain cookie settings
    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      message: "User registered successfully!",
      user: { username: newUser.username, email: newUser.email },
    });
  } catch (error) {
    // Fixed: properly using 'error' and removed the 'throw err' that crashed the server
    console.error("Registration Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error during registration." });
  }
}

/**
 * * @login user
 * @description login user and send data user data in response
 * */
async function loginUserController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Adjust sameSite for production
      maxAge: 24 * 60 * 60 * 1000,
    };

    // Secure cross-domain cookie settings
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "User logged in successfully!",
      user: { username: user.username, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
}

/**
 * * @logout user
 * @description add cookie to the blacklist
 * */
async function logoutUserController(req, res) {
  const token = req.cookies.token;

  if (token) {
    await tokenBlackListModel.create({ token });
  }

  res.clearCookie("token");

  res.status(200).json({
    message: "You are now logged out.",
  });
}

/**
 * * @get current user
 * */
async function getMeController(req, res) {
  try {
    // Fixed: Reverted to req.user.id to match the JWT payload
    const user = await userModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Get Me Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error while fetching user." });
  }
}

module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController,
  getMeController,
};
