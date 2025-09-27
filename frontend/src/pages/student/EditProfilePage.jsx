import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../apiConfig";

const StudentEditProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/students/getProfile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/students/updateProfile",
        student,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/student/profile");
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;
  if (!student) return <Typography mt={5}>No profile data found.</Typography>;

  return (
    <Box maxWidth={600} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2}>
      <Typography variant="h5" mb={2}>Edit Profile</Typography>

      <TextField
        fullWidth
        label="Name"
        name="name"
        value={student.name || ""}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Email"
        name="email"
        value={student.email || ""}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Phone"
        name="phone"
        value={student.phone || ""}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Location"
        name="location"
        value={student.location || ""}
        onChange={handleChange}
        margin="normal"
      />
      <TextField
        fullWidth
        label="About"
        name="about"
        value={student.about || ""}
        onChange={handleChange}
        multiline
        rows={4}
        margin="normal"
      />

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={saving}
        sx={{ mt: 2 }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
};

export default StudentEditProfile;
