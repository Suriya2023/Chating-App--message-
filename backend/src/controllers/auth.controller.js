import cloudinary from '../DataBase/clloudnary.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// =================== SIGNUP ===================
export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            message: "Signup successful",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || null
            }
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// =================== LOGIN ===================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials (email)" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials (password)" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic || null
            }
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// =================== LOGOUT ===================
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            expires: new Date(0), // Immediately expires the cookie
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        console.error("Logout Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// =================== UPDATE PROFILE ===================
export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (err) {
        console.error("Update Profile Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// =================== CHECK AUTH ===================
export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).select("-password");

        res.status(200).json({ user });
    } catch (err) {
        console.error("Check Auth Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
