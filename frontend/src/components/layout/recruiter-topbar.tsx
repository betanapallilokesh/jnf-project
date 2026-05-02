"use client";

import { useState } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import useRecruiterSession from "@/features/auth/hooks/use-recruiter-session";
import { routes } from "@/lib/routes";
import { signOut } from "next-auth/react";

export default function RecruiterTopbar() {
  const { session } = useRecruiterSession();
  const recruiterName = session?.recruiter_name?.trim() || "Recruiter";
  const recruiterEmail = session?.recruiter_email?.trim() || "Unknown Email";

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await signOut({ callbackUrl: routes.public.login, redirect: true });
  };

  return (
    <Box
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        px: { xs: 2, md: 4 },
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: "1400px", mx: "auto" }}
      >
        <Typography 
          variant="h6" 
          component={Link} 
          href={routes.recruiter.dashboard}
          sx={{ 
            fontWeight: 700, 
            color: "text.primary",
            textDecoration: "none"
          }}
        >
          Recruiter Portal
        </Typography>

        <Stack direction="row" spacing={3} alignItems="center">
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 1 }}>
            <Button 
              component={Link} 
              href={routes.recruiter.dashboard}
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Dashboard
            </Button>
            <Button 
              component={Link} 
              href={routes.recruiter.jnfs}
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              All JNFs
            </Button>
            <Button 
              component={Link} 
              href={routes.recruiter.company}
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Company
            </Button>
          </Box>

          <Button
            component={Link}
            href={routes.recruiter.newJnf}
            variant="contained"
            sx={{
              bgcolor: "#006466",
              "&:hover": { bgcolor: "#004b4d" },
              fontSize: "0.95rem",
              fontWeight: 600,
              px: { xs: 2, md: 3 },
              py: 1,
              borderRadius: "8px",
            }}
          >
            + New INF
          </Button>

          <Button
            component={Link}
            href={routes.recruiter.newJnf}
            variant="contained"
            sx={{
              bgcolor: "#1B3B6F",
              "&:hover": { bgcolor: "#122a52" },
              fontSize: "0.95rem",
              fontWeight: 600,
              px: { xs: 2, md: 3 },
              py: 1,
              borderRadius: "8px",
            }}
          >
            + New JNF
          </Button>

          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ p: 0.5 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ bgcolor: "#1B3B6F", width: 40, height: 40 }}>
              {recruiterName.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Stack>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
              mt: 1.5,
              minWidth: 220,
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 20,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {recruiterName}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", wordBreak: "break-all" }}>
            {recruiterEmail}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem 
          component={Link} 
          href={routes.recruiter.dashboard} 
          onClick={handleClose}
          sx={{ py: 1.5, display: { xs: 'block', md: 'none' } }}
        >
          Dashboard
        </MenuItem>

        <MenuItem 
          component={Link} 
          href={routes.recruiter.jnfs} 
          onClick={handleClose}
          sx={{ py: 1.5, display: { xs: 'block', md: 'none' } }}
        >
          All JNFs
        </MenuItem>
        
        <MenuItem 
          component={Link} 
          href={routes.recruiter.company} 
          onClick={handleClose}
          sx={{ py: 1.5 }}
        >
          Company Profile
        </MenuItem>
        
        <MenuItem 
          onClick={handleLogout}
          sx={{ color: "error.main", py: 1.5, fontWeight: 500 }}
        >
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}
