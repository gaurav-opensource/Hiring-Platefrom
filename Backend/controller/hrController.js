const Joi = require("joi");
const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const Job = require('../model/job.model');

// Hr Register Schema validation
const hrSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  contact: Joi.string().required(),
  companyName: Joi.string().required(),
  position: Joi.string().required()
});


// Hr Login Schema validation
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


// Hr Register 
exports.registerHR = async (req, res) => {
  const { error } = hrSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const { name, email, password, contact,companyName, position } = req.body;


    const existingHR = await User.findOne({ email });
    if (existingHR) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const hr = new User({
      name,
      email,
      password: hashedPassword,
      contact,
      companyName,
      position,
      role: "hr",
    });

    await hr.save();

    return res.status(200).json({ message: "HR registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



// Hr Profile
exports.getHRProfile = async (req, res) => {
  try {
    const hr = await User.findById(req.user.userId); // from middleware
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    return res.status(200).json({
      id: hr._id,
      name: hr.name,
      email: hr.email,
      contact: hr.contact,
      position: hr.position
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Update Hr Profile
exports.updateHRProfile = async (req, res) => {
  try {
    const hr = await User.findById(req.user.userId);
    if (!hr) {
      return res.status(404).json({ message: "HR not found" });
    }

    const fields = ["name", "contact", "position"];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        hr[field] = req.body[field];
      }
    });

    await hr.save();
    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Hr create a Job
exports.createJob = async(req, res) => {
  try {
    const jobData = req.body;
    console.log(req.user.userId)

    // HR ka ID jo login hai usse set karo (req.user._id JWT se aayega)
    jobData.postedBy = req.user.userId;

    const job = await Job.create(jobData);
    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: "Job creation failed", error: error.message });
  }
};


// Get job by Hr id
exports.getJobsByHR = async (req, res) => {
  try {
    // Get HR ID from authenticated user
    const hrId = req.user.userId;

    // Fetch jobs posted by this HR
    const jobs = await Job.find({ postedBy: hrId });

    return res.status(200).json({ jobs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
};
