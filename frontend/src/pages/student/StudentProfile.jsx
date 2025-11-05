import { useEffect, useState } from "react";
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
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Loader from "../../ui/Loader";
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
        <Loader />
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
    <Box
      sx={{
        minHeight: "100vh",
        py: 5, // 40px top & bottom padding
        px: { xs: 2, sm: 4 },
        background: "linear-gradient(to bottom right, #f5f7fa, #e6ecf5)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 950,
          mx: "auto",
          p: 4,
          borderRadius: 4,
          bgcolor: "white",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header Section */}
        <Box display="flex" alignItems="center" gap={3} mb={4}>
          <Avatar
            src={student.profilePhoto}
            alt={student.name}
            sx={{ width: 110, height: 110, border: "3px solid #0a66c2" }}
          />
          <Box flexGrow={1}>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {student.name}
            </Typography>
            <Typography color="text.secondary">{student.email}</Typography>
            <Typography color="text.secondary">{student.phone}</Typography>
            <Typography color="text.secondary">{student.location}</Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#0a66c2",
              "&:hover": { bgcolor: "#004182" },
              fontWeight: "bold",
              borderRadius: "10px",
              px: 3,
            }}
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </Button>
        </Box>

        {/* --- Reusable Section Component --- */}
        {[
          {
            title: "Education",
            content: (
              <>
                <Typography fontWeight="medium">
                  {student.degree} - {student.branch}
                </Typography>
                <Typography color="text.secondary">
                  {student.college} ({student.graduationYear})
                </Typography>
              </>
            ),
          },
          {
            title: "Skills",
            content: (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {student.skills?.map((skill, i) => (
                  <Chip key={i} label={skill} sx={{ bgcolor: "#e3f2fd", fontWeight: 500 }} />
                ))}
              </Box>
            ),
          },
          {
            title: "About",
            content: (
              <Typography>
                {student.about || "No additional information provided."}
              </Typography>
            ),
          },
          {
            title: "Projects",
            content: student.projects?.length ? (
              <List>
                {student.projects.map((proj, i) => (
                  <ListItem key={i} alignItems="flex-start">
                    <ListItemText
                      primary={<Typography fontWeight="bold">{proj.title}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2">{proj.description}</Typography>
                          {proj.githubLink && (
                            <Link href={proj.githubLink} target="_blank" underline="hover" color="primary">
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
            ),
          },
          {
            title: "Experience",
            content: student.experience?.length ? (
              <List>
                {student.experience.map((exp, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{exp.role}</Typography>}
                      secondary={`${exp.company} • ${exp.duration}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No experience added.</Typography>
            ),
          },
          {
            title: "Certifications",
            content: student.certifications?.length ? (
              <List>
                {student.certifications.map((cert, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={<Typography fontWeight="bold">{cert.title}</Typography>}
                      secondary={`${cert.issuer} • ${cert.year}`}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography>No certifications added.</Typography>
            ),
          },
          {
            title: "Social Links",
            content: (
              <Box display="flex" gap={3} flexWrap="wrap">
                {student.socialLinks?.linkedin && (
                  <Link href={student.socialLinks.linkedin} target="_blank" underline="hover" color="#0a66c2">
                    LinkedIn
                  </Link>
                )}
                {student.socialLinks?.github && (
                  <Link href={student.socialLinks.github} target="_blank" underline="hover" color="text.primary">
                    GitHub
                  </Link>
                )}
                {student.socialLinks?.portfolio && (
                  <Link href={student.socialLinks.portfolio} target="_blank" underline="hover" color="text.primary">
                    Portfolio
                  </Link>
                )}
                {!student.socialLinks?.linkedin &&
                  !student.socialLinks?.github &&
                  !student.socialLinks?.portfolio && (
                    <Typography color="text.secondary">No social links added.</Typography>
                  )}
              </Box>
            ),
          },
          {
            title: "Resume",
            content: student.resume ? (
              <Link href={student.resume} target="_blank" underline="hover" color="primary">
                View Resume
              </Link>
            ) : (
              <Typography>No resume uploaded.</Typography>
            ),
          },
        ].map((section, i) => (
          <Paper
            key={i}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: "1px solid #e0e0e0",
              transition: "all 0.3s ease",
              "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
            }}
          >
            <Typography variant="h6" mb={1.5} color="primary" fontWeight="bold">
              {section.title}
            </Typography>
            {section.content}
          </Paper>
        ))}
      </Paper>
    </Box>
  );
};

export default StudentProfile;
