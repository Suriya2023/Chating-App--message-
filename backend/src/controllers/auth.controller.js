import cloudinary from '../DataBase/clloudnary.js';
import { generateToken } from '../DataBase/token.js';
import userSchema from '../models/user.model.js';
import bcrypt from 'bcryptjs';

 
 
 

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingUser = await userSchema.findOne({ email });
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

        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic,
        });

    } catch (err) {
        console.error("Signup Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await userSchema.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials (email)" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials (password)" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Dummy logout route
export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { mmaxAge: 0 })
        res.status(200).json({ message: "Logout Successfully" });

    } catch (error) {
        console.error("Error in Signup Controller:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await userSchema.findByIdAndUpdate(
            userId,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error In CheckAuth Controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
}
