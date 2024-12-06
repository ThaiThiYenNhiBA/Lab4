const User = require('../models/userModel');
const logger = require('../services/logger');
const bcrypt = require('bcrypt'); // Thư viện mã hóa mật khẩu
const fs = require('fs'); // Để ghi log vào file

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            logger.logFailedLogin(username);
            return res.status(401).send('Invalid username!');
        }

        if (user.isLocked) {
            return res.status(403).send('Account locked!');
        }

        // So sánh mật khẩu mã hóa
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            user.failedAttempts += 1;

            // Khóa tài khoản sau 3 lần thất bại
            if (user.failedAttempts >= 3) {
                user.isLocked = true;
                logger.logAccountLocked(username);
            }
            await user.save();

            logger.logFailedLogin(username);
            return res.status(401).send('Invalid credentials!');
        }

        // Reset số lần thất bại nếu đăng nhập thành công
        user.failedAttempts = 0;
        await user.save();

        // Ghi log khi đăng nhập thành công
        logger.logSuccessfulLogin(username); // Ghi vào log khi đăng nhập thành công

        // Thông báo dựa trên vai trò
        const message = user.role === 'admin'
            ? "Welcome Admin! You have full access."
            : "Welcome User! You have limited access.";

        return res.status(200).send(message);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error.');
    }
};




// Hàm tạo tài khoản
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!username || !password || !role) {
            return res.status(400).json({ message: "Missing required fields!" });
        }

        // Kiểm tra role hợp lệ
        const allowedRoles = ['admin', 'user'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role!" });
        }

        // Kiểm tra tài khoản đã tồn tại
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo người dùng mới
        const newUser = new User({
            username,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        logger.log(`User ${username} created with role ${role}.`);
        return res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        console.error(error);
        logger.log(`Error creating account: ${error.message}`);
        return res.status(500).json({ message: "Internal server error!" });
    }
};

