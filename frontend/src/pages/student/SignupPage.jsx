import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { registerStudent } from "../../services/auth.service";

// cloudinary upload helper
const uploadToCloudinary = async (file, type = "image") => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ml_default");
  data.append("folder", "Healthcare");

  const url =
    type === "image"
      ? "https://api.cloudinary.com/v1_1/dznnyaj0z/image/upload"
      : "https://api.cloudinary.com/v1_1/dznnyaj0z/raw/upload";

  const res = await axios.post(url, data);
  return res.data.secure_url;
};

const StudentSignup = () => {
  const [step, setStep] = useState(1); // step1 = details, step2 = upload

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    college: "",
    degree: "",
    branch: "",
    graduationYear: "",
    skills: "",
    about: "",
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
    },
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // form field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm({ ...form, socialLinks: { ...form.socialLinks, [key]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // step 1 submit → go to step 2
  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  // final submit with uploads
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const profilePhotoUrl = profilePhoto
        ? await uploadToCloudinary(profilePhoto, "image")
        : "";
      const resumeUrl = resume ? await uploadToCloudinary(resume, "raw") : "";

      const payload = {
        ...form,
        profilePhoto: profilePhotoUrl,
        resume: resumeUrl,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
      };

      await registerStudent(payload);

      setMessage({
        type: "success",
        text: "Registration completed successfully!",
      });
      setStep(1);
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        college: "",
        degree: "",
        branch: "",
        graduationYear: "",
        skills: "",
        about: "",
        socialLinks: {
          linkedin: "",
          github: "",
          portfolio: "",
        },
      });
      setProfilePhoto(null);
      setResume(null);
      navigate('/login')
    } catch (err) {
      setMessage({ type: "error", text: "Upload failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={600} mx="auto" mt={4}>
      {step === 1 && (
        <>
          <Typography variant="h5" mb={2}>
            Student Signup - Step 1
          </Typography>
          <form onSubmit={handleDetailsSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Location"
              name="location"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="College"
              name="college"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Degree"
              name="degree"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Branch"
              name="branch"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Graduation Year"
              name="graduationYear"
              type="number"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Skills (comma-separated)"
              name="skills"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="About"
              name="about"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="LinkedIn"
              name="socialLinks.linkedin"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="GitHub"
              name="socialLinks.github"
              margin="normal"
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Portfolio"
              name="socialLinks.portfolio"
              margin="normal"
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Next
            </Button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <Typography variant="h5" mb={2}>
            Student Signup - Step 2
          </Typography>
          <form onSubmit={handleUploadSubmit}>
            <Box mt={2}>
              <Typography>Upload Profile Photo</Typography>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files[0])}
              />
            </Box>

            <Box mt={2}>
              <Typography>Upload Resume (PDF)</Typography>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </Box>

            {loading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Finish Signup
              </Button>
            )}
          </form>
        </>
      )}

      {message && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}
    </Box>
  );
};

export default StudentSignup;
