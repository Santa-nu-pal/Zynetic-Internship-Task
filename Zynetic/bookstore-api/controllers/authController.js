const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generatetoken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exiit = await User.findOne({ email });
    if (exiit) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ email, password });
    const token = generatetoken(user._id);
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Signup error occured", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.macthpassword(password)))
      return res.status(401).json({ message: "Invalid credentials!!!" });

    const token = generatetoken(user._id);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login error occured", error: err.message });
  }
};
