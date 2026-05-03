"use client";

import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { listAdminCompanies, deleteAdminCompany, type AdminCompanyOverview } from "../lib/admin-api";
import LoadingState from "@/components/ui/loading-state";

export default function AdminCompaniesTable() {
  const [companies, setCompanies] = useState<AdminCompanyOverview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuCompany, setMenuCompany] = useState<AdminCompanyOverview | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const data = await listAdminCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    company: AdminCompanyOverview,
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCompany(company);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCompany(null);
  };

  const handleDelete = async (company: AdminCompanyOverview) => {
    if (!confirm(`Are you sure you want to completely delete ${company.name}? This action cannot be undone and will delete all associated recruiters and JNFs.`)) {
      handleMenuClose();
      return;
    }
    
    try {
      await deleteAdminCompany(company.id);
      setCompanies((current) => current.filter((c) => c.id !== company.id));
    } catch (error) {
      console.error("Failed to delete company:", error);
      alert("Failed to delete company. Please try again.");
    } finally {
      handleMenuClose();
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <LoadingState message="Loading companies..." />
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          No companies found.
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
              <TableCell>Company Name</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Sector</TableCell>
              <TableCell align="center">Recruiters</TableCell>
              <TableCell align="center">JNFs</TableCell>
              <TableCell>Joined Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company, index) => (
              <TableRow
                key={company.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "#f9fafb",
                  },
                  backgroundColor: index % 2 === 0 ? "inherit" : "#f9fafb",
                }}
              >
                <TableCell sx={{ fontWeight: 600 }}>{company.name}</TableCell>
                <TableCell>
                  <a href={company.website || "#"} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                    {company.website || "N/A"}
                  </a>
                </TableCell>
                <TableCell>{company.sector || "N/A"}</TableCell>
                <TableCell align="center">{company.recruiterCount}</TableCell>
                <TableCell align="center">{company.jnfCount}</TableCell>
                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={(event) => handleMenuClick(event, company)}
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => menuCompany && handleDelete(menuCompany)} sx={{ color: 'error.main' }}>
          🗑️ Delete Company
        </MenuItem>
      </Menu>

      {/* Details modal disabled until backend supports detailed fetch */}
      {/* <AdminCompanyDetailsModal ... /> */}
    </>
  );
}
