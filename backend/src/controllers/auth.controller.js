import cloudinary from '../lib/clloudnary.js';
import { generateToken } from '../lib/token.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required !" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email });
        if (user) {
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
        console.error("Error in Signup Controller:", err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Dummy login route
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        const isPassword = await bcrypt.compare(password, user.password)
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        generateToken(user._id, res)
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })
    } catch (err) {
        console.error("Error in login Controller:", err.message);
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
        const userId = req.user_id
        if (!profilePic) {
            res.status(400).json({ message: "Profile Pic Required" });
        }
        await cloudinary.uploader.upload(profilePic)
        const upDatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(upDatedUser)
    } catch (error) {
        console.log("Error is Update Profile", error)
        res.status(500).json({ message: "internal server error" })
    }
}


export const chackAuth = async (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log("Error In CheckAuth Controller", error.message)
    }
}