const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


module.exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    try {
        // check if the user already exists
        let check_email = await User.findOne({ email: email });
        if (check_email) {
            return res.status(400).json({ message: "User already exists" });
        }
        // hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(200).json({ message: "User created successfully" });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}


module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let check_email = await User.findOne({ email: email });
        if (!check_email) {
            return res.status(400).json({ message: "Email not found" });
        }
        // compare password with the hashed password

        const isMatch = await bcrypt.compare(password, check_email.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        // create jwt token and store the user id in the token
        const token = jwt.sign({ id: check_email._id }, process.env.JWT_SECRET);
        console.log(token);

        res.status(200).json({ token });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}
