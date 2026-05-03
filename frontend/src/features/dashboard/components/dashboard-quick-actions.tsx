import Link from "next/link";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { routes } from "@/lib/routes";

const actionItems = [
  {
    title: "Create New INF",
    description: "Start a fresh Internship Notification Form for a new cycle.",
    href: routes.recruiter.newJnf,
    buttonLabel: "+ New INF",
  },
  {
    title: "Create New JNF",
    description: "Start a fresh Job Notification Form for a new hiring cycle.",
    href: routes.recruiter.newJnf,
    buttonLabel: "+ New JNF",
  },
  {
    title: "Manage JNFs",
    description: "View all drafts, submissions, previews, and status updates.",
    href: routes.recruiter.jnfs,
    buttonLabel: "View All JNFs",
  },
  {
    title: "Company Profile",
    description: "Review or update the company information used across JNFs.",
    href: routes.recruiter.company,
    buttonLabel: "Open Company Page",
  },
] as const;

export default function DashboardQuickActions() {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      useFlexGap
      flexWrap="wrap"
    >
      {actionItems.map((item) => (
        <Card key={item.title} variant="outlined" sx={{ flex: 1, minWidth: 240 }}>
          <CardContent>
            <Stack spacing={2}>
              <Stack spacing={0.75}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  {item.description}
                </Typography>
              </Stack>

              <Button component={Link} href={item.href} variant="contained">
                {item.buttonLabel}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
