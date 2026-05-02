"use client";

import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AdminRecruiterDetailsModal from "./admin-recruiter-details-modal";
import { listAdminRecruiters, deleteAdminRecruiter, type AdminRecruiterOverview } from "../lib/admin-api";
import LoadingState from "@/components/ui/loading-state";

export default function AdminRecruitersTable() {
  const [recruiters, setRecruiters] = useState<AdminRecruiterOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState<AdminRecruiterOverview | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRecruiter, setMenuRecruiter] = useState<AdminRecruiterOverview | null>(null);

  useEffect(() => {
    async function fetchRecruiters() {
      try {
        const data = await listAdminRecruiters();
        setRecruiters(data);
      } catch (error) {
        console.error("Failed to fetch recruiters:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRecruiters();
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, recruiter: AdminRecruiterOverview) => {
    setAnchorEl(event.currentTarget);
    setMenuRecruiter(recruiter);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuRecruiter(null);
  };

  const handleViewDetails = (recruiter: AdminRecruiterOverview) => {
    setSelectedRecruiter(recruiter);
    setModalOpen(true);
    handleMenuClose();
  };

  const handleDelete = async (recruiter: AdminRecruiterOverview) => {
    if (!confirm(`Are you sure you want to completely delete ${recruiter.fullName}? This action cannot be undone and will delete all JNFs created by this recruiter.`)) {
      handleMenuClose();
      return;
    }
    
    try {
      await deleteAdminRecruiter(recruiter.id);
      setRecruiters((current) => current.filter((r) => r.id !== recruiter.id));
    } catch (error) {
      console.error("Failed to delete recruiter:", error);
      alert("Failed to delete recruiter. Please try again.");
    } finally {
      handleMenuClose();
    }
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "#16a34a" : "#dc2626";
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <LoadingState message="Loading recruiters..." />
      </Box>
    );
  }

  if (recruiters.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No recruiters found.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recruiters.map((recruiter, index) => (
              <TableRow
                key={recruiter.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  backgroundColor: index % 2 === 0 ? "inherit" : "#f9fafb",
                }}
              >
                <TableCell>{recruiter.fullName}</TableCell>
                <TableCell>{recruiter.email}</TableCell>
                <TableCell>{recruiter.companyName || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={recruiter.status}
                    sx={{
                      backgroundColor: getStatusColor(recruiter.status),
                      color: "white",
                      fontWeight: 500,
                      borderRadius: 999,
                      textTransform: "capitalize",
                    }}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(event) => handleMenuClick(event, recruiter)}
                    size="small"
                  >
                    ⋮
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => menuRecruiter && handleViewDetails(menuRecruiter)}>
          👁️ View Details
        </MenuItem>
        <MenuItem onClick={() => menuRecruiter && handleDelete(menuRecruiter)} sx={{ color: 'error.main' }}>
          🗑️ Delete Recruiter
        </MenuItem>
      </Menu>

      <AdminRecruiterDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        recruiter={selectedRecruiter}
      />
    </>
  );
}
