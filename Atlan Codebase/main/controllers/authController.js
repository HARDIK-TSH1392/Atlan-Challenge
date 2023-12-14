const User = require('../models/User');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// TODO: Put your JWT_SECRET here
const JWT_SECRET = 'Thisis@Secret';

// Route handler for user registration
exports.createUser = async (req, res) => {
    let success = false;
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success, errors: errors.array() });
        }

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ success, error: "A user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = {
            name: req.body.name,
            password: hashedPassword,
            email: req.body.email
        };

        const user = await User.create(newUser);

        const data = {
            user: {
                id: user.id
            }
        };

        const authToken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.status(200).json({ success, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Route handler for user login
exports.login = async (req, res) => {
    let success = false
    // If there are errors, return Bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: [{ param: "email", msg: "Please try to login with correct credentials" }] });

    }

    // Destructuring to obtain email and password from body
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            success = false
            return res.status(400).json({ success, errors: [{ param: "password", msg: "Please try to login with correct credentials" }] });

        }

        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success = true
        res.json({ success, authToken })
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};

// Route handler to get user details
exports.getUser = async (req, res) => {
    try {
        userId = req.user.id;
        // Selecting all the user fields except the password
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
};
