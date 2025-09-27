import  { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { registerStudent } from "../../services/auth.service";
import Loader from '../../ui/Loader';
import uploadToCloudinary from '../../services/cloudinary.service';
import API from "../../apiConfig";

const StudentSignup = () => {
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
    socialLinks: { linkedin: "", github: "", portfolio: "" },
  });

  const [files, setFiles] = useState({ profilePhoto: null, resume: null });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      const key = name.split(".")[1];
      setForm({
        ...form,
        socialLinks: { ...form.socialLinks, [key]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e, type) => {
    setFiles({ ...files, [type]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const [profilePhotoUrl, resumeUrl] = await Promise.all([
        files.profilePhoto ? uploadToCloudinary(files.profilePhoto, "image") : "",
        files.resume ? uploadToCloudinary(files.resume, "raw") : "",
      ]);

      const payload = {
        ...form,
        profilePhoto: profilePhotoUrl,
        resume: resumeUrl,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
      };

      await registerStudent(payload);

      setMessage({ type: "success", text: "Registration completed successfully!" });
      navigate("/login");
    } catch (err) {
      setMessage({ type: "error", text: "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%", borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom color="primary">
          Student Signup
        </Typography>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }}>
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {["name", "email", "password", "phone", "location", "college", "degree", "branch", "graduationYear", "skills", "about"].map((field) => (
            <TextField
              key={field}
              fullWidth
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={field === "password" ? "password" : field === "graduationYear" ? "number" : "text"}
              margin="normal"
              onChange={handleChange}
              required={["name", "email", "password"].includes(field)}
            />
          ))}

          {["linkedin", "github", "portfolio"].map((key) => (
            <TextField
              key={key}
              fullWidth
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={`socialLinks.${key}`}
              margin="normal"
              onChange={handleChange}
            />
          ))}

          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Profile Photo
            </Typography>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profilePhoto")} />
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle1" gutterBottom>
              Upload Resume (PDF)
            </Typography>
            <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, "resume")} />
          </Box>

          <Box mt={3}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <Loader />  {/* ✅ Use your custom Loader here */}
              </Box>
            ) : (
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Signup
              </Button>
            )}
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "none", color: "#1976d2", fontWeight: "500" }}>
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default StudentSignup;
