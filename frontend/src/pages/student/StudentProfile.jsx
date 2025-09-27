import  { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Typography,
  Divider,
  Chip,
  Link,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from '../../ui/Loader'; // ✅ Import your Loader component
import API from "../../apiConfig";

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/students/getProfile`, {
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Loader /> {/* ✅ Show Loader while loading */}
      </Box>
    );
  }

  if (!student) {
    return (
      <Typography mt={5} textAlign="center">
        No profile data found.
      </Typography>
    );
  }

  return (
    <Box maxWidth={900} mx="auto" mt={6} p={4} boxShadow={3} borderRadius={2} bgcolor="background.paper">
      {/* Header */}
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar src={student.profilePhoto} alt={student.name} sx={{ width: 100, height: 100 }} />
        <Box flexGrow={1}>
          <Typography variant="h5" fontWeight="bold">{student.name}</Typography>
          <Typography color="text.secondary">{student.email}</Typography>
          <Typography color="text.secondary">{student.phone}</Typography>
          <Typography color="text.secondary">{student.location}</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/edit-profile")}>
          Edit Profile
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Education */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Education</Typography>
        <Typography>{student.degree} - {student.branch}</Typography>
        <Typography>{student.college} ({student.graduationYear})</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Skills */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Skills</Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          {student.skills?.map((skill, index) => (
            <Chip key={index} label={skill} />
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* About */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>About</Typography>
        <Typography>{student.about || "No additional information provided."}</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Projects */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Projects</Typography>
        {student.projects?.length > 0 ? (
          <List>
            {student.projects.map((proj, index) => (
              <ListItem key={index} alignItems="flex-start">
                <ListItemText
                  primary={proj.title}
                  secondary={
                    <>
                      <Typography variant="body2">{proj.description}</Typography>
                      {proj.githubLink && (
                        <Link href={proj.githubLink} target="_blank" rel="noopener" underline="hover">
                          View on GitHub
                        </Link>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No projects added.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Experience */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Experience</Typography>
        {student.experience?.length > 0 ? (
          <List>
            {student.experience.map((exp, index) => (
              <ListItem key={index}>
                <ListItemText primary={exp.role} secondary={`${exp.company} • ${exp.duration}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No experience added.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Certifications */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Certifications</Typography>
        {student.certifications?.length > 0 ? (
          <List>
            {student.certifications.map((cert, index) => (
              <ListItem key={index}>
                <ListItemText primary={cert.title} secondary={`${cert.issuer} • ${cert.year}`} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No certifications added.</Typography>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Social Links */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Social Links</Typography>
        <Box display="flex" gap={2}>
          {student.socialLinks?.linkedin && (
            <Link href={student.socialLinks.linkedin} target="_blank" underline="hover">
              LinkedIn
            </Link>
          )}
          {student.socialLinks?.github && (
            <Link href={student.socialLinks.github} target="_blank" underline="hover">
              GitHub
            </Link>
          )}
          {student.socialLinks?.portfolio && (
            <Link href={student.socialLinks.portfolio} target="_blank" underline="hover">
              Portfolio
            </Link>
          )}
          {!student.socialLinks?.linkedin &&
            !student.socialLinks?.github &&
            !student.socialLinks?.portfolio && (
              <Typography color="text.secondary">No social links added.</Typography>
            )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Resume */}
      <Box mb={3}>
        <Typography variant="h6" mb={1}>Resume</Typography>
        {student.resume ? (
          <Link href={student.resume} target="_blank" underline="hover">
            View Resume
          </Link>
        ) : (
          <Typography>No resume uploaded.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default StudentProfile;
