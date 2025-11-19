import { useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import {
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  FormGroup,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

export default function EventManagers() {
  const { api, user } = useAuth();
  const [managers, setManagers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingManager, setEditingManager] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    permissions: {
      canCreateEvents: true,
      canEditEvents: true,
      canDeleteEvents: false,
      canManageRegistrations: true,
      canGenerateCertificates: true,
      canViewAnalytics: false,
    },
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "organization") {
      fetchManagers();
    }
  }, [user]);

  const fetchManagers = async () => {
    try {
      const res = await api.get("/api/organization/event-managers");
      setManagers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenDialog = (manager = null) => {
    if (manager) {
      setEditingManager(manager);
      setFormData({
        email: manager.email,
        password: "",
        name: manager.name,
        phone: manager.phone || "",
        permissions: manager.permissions,
      });
    } else {
      setEditingManager(null);
      setFormData({
        email: "",
        password: "",
        name: "",
        phone: "",
        permissions: {
          canCreateEvents: true,
          canEditEvents: true,
          canDeleteEvents: false,
          canManageRegistrations: true,
          canGenerateCertificates: true,
          canViewAnalytics: false,
        },
      });
    }
    setOpenDialog(true);
    setError("");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingManager(null);
    setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      if (editingManager) {
        await api.put(`/api/organization/event-managers/${editingManager._id}`, {
          name: formData.name,
          phone: formData.phone,
          permissions: formData.permissions,
        });
      } else {
        await api.post("/api/organization/event-managers", formData);
      }
      fetchManagers();
      handleCloseDialog();
    } catch (err) {
      setError(err.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event manager?")) return;

    try {
      await api.delete(`/api/organization/event-managers/${id}`);
      fetchManagers();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  const toggleActive = async (manager) => {
    try {
      await api.put(`/api/organization/event-managers/${manager._id}`, {
        isActive: !manager.isActive,
      });
      fetchManagers();
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  // If unauthorized
  if (user?.role !== "organization") {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 4 }}>
          Only organizations can access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          py: 6,
          px: { xs: 2, md: 6 },
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight="bold">
          Event Managers
        </Typography>

        <Typography variant="subtitle1" sx={{ opacity: 0.9, mt: 1 }}>
          Manage your event managers, permissions & access control
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{
              background: "#ffffff",
              color: "#5e35b1",
              textTransform: "none",
              fontWeight: "bold",
              px: 3,
              borderRadius: "10px",
              "&:hover": { background: "#f4f4f4" },
            }}
          >
            Add Event Manager
          </Button>
        </Box>
      </Box>

      {/* ---------- CONTENT ---------- */}
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          {managers.map((manager) => (
            <Grid item xs={12} md={6} key={manager._id}>
              <Card
                sx={{
                  borderRadius: "15px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {manager.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {manager.email}
                      </Typography>
                      {manager.phone && (
                        <Typography variant="body2" color="text.secondary">
                          {manager.phone}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      label={manager.isActive ? "Active" : "Inactive"}
                      color={manager.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>

                  {/* Permissions */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="bold">Permissions</Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                      {manager.permissions.canCreateEvents && (
                        <Chip label="Create Events" size="small" />
                      )}
                      {manager.permissions.canEditEvents && (
                        <Chip label="Edit Events" size="small" />
                      )}
                      {manager.permissions.canDeleteEvents && (
                        <Chip label="Delete Events" size="small" />
                      )}
                      {manager.permissions.canManageRegistrations && (
                        <Chip label="Manage Registrations" size="small" />
                      )}
                      {manager.permissions.canGenerateCertificates && (
                        <Chip label="Generate Certificates" size="small" />
                      )}
                      {manager.permissions.canViewAnalytics && (
                        <Chip label="View Analytics" size="small" />
                      )}
                    </Box>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                    <Button size="small" onClick={() => toggleActive(manager)}>
                      {manager.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <IconButton size="small" onClick={() => handleOpenDialog(manager)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(manager._id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {managers.length === 0 && (
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Typography color="text.secondary" fontSize={18}>
              No event managers yet. Add one to get started!
            </Typography>
          </Box>
        )}
      </Container>

      {/* ---------- Dialog ---------- */}
      {/* ---------- Dialog ---------- */}
<Dialog
  open={openDialog}
  onClose={handleCloseDialog}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: "20px",
      backdropFilter: "blur(12px)",
      background: "rgba(255,255,255,0.75)",
      border: "1px solid rgba(255,255,255,0.4)",
      boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
      p: 1,
    },
  }}
  TransitionProps={{
    onEntering: () => {},
  }}
>
  <DialogTitle
    sx={{
      fontWeight: "bold",
      fontSize: "1.5rem",
      pb: 1,
      borderBottom: "1px solid rgba(0,0,0,0.08)",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
    }}
  >
    {editingManager ? "Edit Event Manager" : "Add Event Manager"}
  </DialogTitle>

  <DialogContent sx={{ mt: 2 }}>
    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

    {/* Name */}
    <TextField
      fullWidth
      label="Full Name"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      margin="normal"
      required
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
    />

    {/* Email */}
    <TextField
      fullWidth
      label="Email Address"
      type="email"
      value={formData.email}
      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      margin="normal"
      required
      disabled={!!editingManager}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
    />

    {/* Password only when creating */}
    {!editingManager && (
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        margin="normal"
        required
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
      />
    )}

    {/* Phone */}
    <TextField
      fullWidth
      label="Phone Number"
      value={formData.phone}
      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      margin="normal"
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
    />

    {/* Permissions Heading */}
    <Box
      sx={{
        mt: 4,
        mb: 1,
        fontWeight: "bold",
        fontSize: "1.1rem",
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      Permissions
    </Box>

    <Box
      sx={{
        p: 2,
        borderRadius: "14px",
        border: "1px solid rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.7)",
      }}
    >
      <FormGroup>
        {Object.keys(formData.permissions).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Switch
                checked={formData.permissions[key]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    permissions: {
                      ...formData.permissions,
                      [key]: e.target.checked,
                    },
                  })
                }
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#764ba2",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#764ba2",
                  },
                }}
              />
            }
            label={key.replace(/([A-Z])/g, " $1")}
          />
        ))}
      </FormGroup>
    </Box>
  </DialogContent>

  <DialogActions sx={{ p: 2 }}>
    <Button
      onClick={handleCloseDialog}
      sx={{
        textTransform: "none",
        borderRadius: "10px",
      }}
    >
      Cancel
    </Button>

    <Button
      onClick={handleSubmit}
      variant="contained"
      disabled={loading}
      sx={{
        textTransform: "none",
        borderRadius: "10px",
        px: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {editingManager ? "Update" : "Create"}
    </Button>
  </DialogActions>
</Dialog>

    </div>
  );
}
