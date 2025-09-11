const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { studentRegisterSchema, loginSchema } = require('../config/Schema');



exports.register = async (req, res) => {
  const { error } = studentRegisterSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const {
      name,
      email,
      password,
      profilePhoto,
      phone,
      college,
      degree,
      branch,
      graduationYear,
      skills,
      projects,
      experience,
      certifications,
      about,
      socialLinks,
      resume,
      location
    } = req.body;

    const existingStudent = await User.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new User({
      role: "student",
      name,
      email,
      password: hashedPassword,
      profilePhoto,
      phone,
      college,
      degree,
      branch,
      graduationYear,
      skills,
      projects,
      experience,
      certifications,
      about,
      socialLinks,
      resume,
      location
    });

    await newStudent.save();

    res.status(201).json({ message: "Student registered successfully." });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



exports.login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.status(200).json({
      token,
      role: user.role,  
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        location: user.location,
        phone: user.phone
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};




exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      college: user.college,
      degree: user.degree,
      branch: user.branch,
      graduationYear: user.graduationYear,
      location: user.location,
      skills: user.skills,
      experience: user.experience,
      projects: user.projects,
      certifications: user.certifications,
      about: user.about,
      socialLinks: user.socialLinks,
      resume: user.resume
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
     console.log("hai , my name is gaurav yadav")
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone, location, about } = req.body;

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    if (about !== undefined) user.about = about;

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


