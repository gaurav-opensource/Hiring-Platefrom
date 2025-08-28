import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Chip,
  Link,
} from "@mui/material";



const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log(token)

      const res = await axios.get("http://localhost:5000/api/students/getProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudent(res.data);
    } catch (err) {
      console.error("Profile fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <CircularProgress sx={{ mt: 5 }} />;

  if (!student) return <Typography mt={5}>No profile data found.</Typography>;

  return (
    <Box maxWidth={800} mx="auto" mt={4} p={3} boxShadow={3} borderRadius={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          src={student.profilePhoto}
          alt={student.name}
          sx={{ width: 100, height: 100 }}
        />
        <Box>
          <Typography variant="h5">{student.name}</Typography>
          <Typography color="text.secondary">{student.email}</Typography>
          <Typography color="text.secondary">{student.phone}</Typography>
          <Typography color="text.secondary">{student.location}</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Education</Typography>
      <Typography>{student.degree} - {student.branch}</Typography>
      <Typography>{student.college} ({student.graduationYear})</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Skills</Typography>
      <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
        {student.skills?.map((skill, i) => (
          <Chip key={i} label={skill} />
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">About</Typography>
      <Typography mt={1}>{student.about}</Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Social Links</Typography>
      <Box mt={1}>
        {student.socialLinks?.linkedin && (
          <Link href={student.socialLinks.linkedin} target="_blank" mr={2}>
            LinkedIn
          </Link>
        )}
        {student.socialLinks?.github && (
          <Link href={student.socialLinks.github} target="_blank" mr={2}>
            GitHub
          </Link>
        )}
        {student.socialLinks?.portfolio && (
          <Link href={student.socialLinks.portfolio} target="_blank">
            Portfolio
          </Link>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Resume</Typography>
      {student.resume ? (
        <Link href={student.resume} target="_blank">
          View Resume
        </Link>
      ) : (
        <Typography>No resume uploaded.</Typography>
      )}
    </Box>
  );
};

export default StudentProfile;
