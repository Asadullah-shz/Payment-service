const AuthModel = require('../models/auth')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


async function Register(req, res) {

    try {
        const { username, email, password } = req.body

        const isAlready = await AuthModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })


        if (isAlready) {

            return res.status(409).json({
                message: "User Already Exist"
            })

        }


        const hash = await bcrypt.hash(password, 10)

        const user = await AuthModel.create({
            username,
            email,
            password: hash,
        })


        const token = jwt.sign({

            id: user._id,
            role: user.role,


        }, process.env.JWT_TOKEN, {
            expiresIn: "1h"
        })

        res.cookie("token", token)


        res.status(201).json({
            message: "User is Registerd Sucessfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
}

async function LoginUser(req, res) {
    try {
        const { username, email, password } = req.body

        const user = await AuthModel.findOne({
            $or: [
                { username },
                { email }
            ]
        })

        if ((!username && !email) || !password) {
            return res.status(401).json({
                message: "Invalid Credientals"
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({
                message: "Invalid Password"
            })
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
        }, process.env.JWT_TOKEN)

        res.cookie("token", token)

        res.status(200).json({
            message: "User Logged in Sucessfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error", error: error.message
        })
    }
}

async function Logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ "message": "Logged out successfully" })
}

async function UpdateRole(req,res) {
    try {
        const { userId, newRole } = req.body;
        
        if (!userId || !newRole) {
            return res.status(400).json({ message: "userId and newRole are required" });
        }
        
        const updatedUser = await AuthModel.findByIdAndUpdate(
            userId,
            { role: newRole },
            { new: true }
        );
        
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "Role updated successfully",
            user: {
                id: updatedUser._id,
                username: updatedUser.username,
                role: updatedUser.role
            }
        });
    } catch (error) {
        console.error("Error updating role:", error);
        res.status(500).json({
            message: "Internal Server Error", 
            error: error.message
        });
    }
}

module.exports = { Register, LoginUser, Logout, UpdateRole }