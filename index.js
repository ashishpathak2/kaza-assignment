const express = require("express");
const { Sequelize, DataTypes, Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const PORT = 3000;
const app = express();
app.use(express.json());
app.use(cookieParser());

//Orm setup - For interaction between application and database
const sequelize = new Sequelize("kaza", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

//Defined user schema
const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
});


sequelize.sync().then(() => console.log("Database synced"));

//Function for token generation
const generateToken = (userId) => jwt.sign({ id: userId }, "sadas123e11safdassad12lfas", { expiresIn: "1h" });

//User signup route 
app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { username }] } });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//user signin route 
app.post("/signin", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "Email/Username and password are required" });
    }

    const user = await User.findOne({ where: { [Op.or]: [{ email: identifier }, { username: identifier }] } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ message: "Signin successful", user: { id: user.id, email: user.email, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//Middleware funtion for authentication validation 
const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, "your_secret_key");
    req.user = await User.findByPk(decoded.id);
    if (!req.user) return res.status(401).json({ error: "User not found" });
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};


//user profile route for data updation
app.put("/profile", authenticate, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      return res.status(400).json({ error: "At least one field (email or password) is required" });
    }

    if (email) req.user.email = email;
    if (password) req.user.password = await bcrypt.hash(password, 10);
    
    await req.user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//user logout route
app.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signout successful" });
});


//server port running config
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));