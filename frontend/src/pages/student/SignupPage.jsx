import { useState } from "react";
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
import Loader from "../../ui/Loader";
import uploadToCloudinary from "../../services/cloudinary.service";

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

      setMessage({ type: "success", text: "Registration successful!" });
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
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
        background: "linear-gradient(135deg, #0A0F1F, #1B2340, #301A4A)",
        position: "relative",
      }}
    >
      {/* Background Gradient Blobs */}
      <Box
        sx={{
          position: "absolute",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(128, 0, 255, 0.25)",
          filter: "blur(150px)",
          top: "10%",
          left: "10%",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          backgroundColor: "rgba(0, 128, 255, 0.25)",
          filter: "blur(160px)",
          bottom: "10%",
          right: "10%",
          zIndex: 0,
        }}
      />

      {/* Main Signup Card */}
      <Paper
        elevation={10}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: 4,
          borderRadius: 4,
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          position: "relative",
          zIndex: 1,
          color: "#fff",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ color: "#fff", fontWeight: "bold", mb: 2 }}
        >
          Student Signup
        </Typography>

        {message && (
          <Alert
            severity={message.type}
            sx={{
              mb: 2,
              bgcolor:
                message.type === "success"
                  ? "rgba(0,255,128,0.1)"
                  : "rgba(255,0,0,0.1)",
              color: "#fff",
            }}
          >
            {message.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          {/* Main Form Fields */}
          {[
            "name",
            "email",
            "password",
            "phone",
            "location",
            "college",
            "degree",
            "branch",
            "graduationYear",
            "skills",
            "about",
          ].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={
                field === "password"
                  ? "password"
                  : field === "graduationYear"
                  ? "number"
                  : "text"
              }
              fullWidth
              margin="normal"
              onChange={handleChange}
              required={["name", "email", "password"].includes(field)}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            />
          ))}

          {/* Social Links */}
          {["linkedin", "github", "portfolio"].map((key) => (
            <TextField
              key={key}
              fullWidth
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              name={`socialLinks.${key}`}
              margin="normal"
              onChange={handleChange}
              InputLabelProps={{ style: { color: "#bbb" } }}
              InputProps={{
                style: {
                  color: "#fff",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            />
          ))}

          {/* File Uploads */}
          <Box mt={2}>
            <Typography variant="subtitle1" sx={{ color: "#ddd" }}>
              Upload Profile Photo
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "profilePhoto")}
              style={{ marginTop: "5px", color: "#bbb" }}
            />
          </Box>

          <Box mt={2}>
            <Typography variant="subtitle1" sx={{ color: "#ddd" }}>
              Upload Resume (PDF)
            </Typography>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "resume")}
              style={{ marginTop: "5px", color: "#bbb" }}
            />
          </Box>

          {/* Submit Button */}
          <Box mt={3}>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <Loader />
              </Box>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  bgcolor: "purple",
                  ":hover": { bgcolor: "#8b3dff" },
                }}
              >
                Signup
              </Button>
            )}
          </Box>

          {/* Login Link */}
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "#ccc" }}
          >
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#b388ff", fontWeight: "600" }}>
              Login here
            </Link>
          </Typography>
        </form>
      </Paper>
    </Box>
  );
};

export default StudentSignup;
