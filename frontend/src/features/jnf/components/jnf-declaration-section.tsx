import { useState } from "react";
import Alert from "@mui/material/Alert";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SectionCard from "@/components/ui/section-card";
import type { JnfFieldErrors } from "../lib/jnf-validation";
import type { JnfRecord } from "../types";
import JnfFormGrid from "./jnf-form-grid";

type JnfDeclarationSectionProps = Readonly<{
  form: JnfRecord;
  setForm: React.Dispatch<React.SetStateAction<JnfRecord>>;
  fieldErrors: JnfFieldErrors;
  embedded?: boolean;
}>;

export default function JnfDeclarationSection({
  form,
  setForm,
  fieldErrors,
  embedded = false,
}: JnfDeclarationSectionProps) {
  const [hasReadGuidelines, setHasReadGuidelines] = useState(false);
  const content = (
    <Stack spacing={2.5}>
      <Alert severity="info">
        Final submission is completed from the preview page, but the declaration
        details and confirmations should be completed here first.
      </Alert>

      <JnfFormGrid>
        <TextField
          label="Authorised Signatory Name"
          required
          value={form.declaration.authorised_signatory_name}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                authorised_signatory_name: event.target.value,
              },
            }))
          }
          error={Boolean(fieldErrors["declaration.authorised_signatory_name"])}
          helperText={fieldErrors["declaration.authorised_signatory_name"]}
          fullWidth
        />

        <TextField
          label="Authorised Signatory Designation"
          required
          value={form.declaration.authorised_signatory_designation}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                authorised_signatory_designation: event.target.value,
              },
            }))
          }
          error={Boolean(fieldErrors["declaration.authorised_signatory_designation"])}
          helperText={fieldErrors["declaration.authorised_signatory_designation"]}
          fullWidth
        />

        <TextField
          label="Authorised Signatory Email"
          type="email"
          value={form.declaration.authorised_signatory_email}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                authorised_signatory_email: event.target.value,
              },
            }))
          }
          fullWidth
        />

        <TextField
          label="Authorised Signatory Phone"
          value={form.declaration.authorised_signatory_phone}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                authorised_signatory_phone: event.target.value,
              },
            }))
          }
          fullWidth
        />

        <TextField
          label="Declaration Place"
          value={form.declaration.declaration_place}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                declaration_place: event.target.value,
              },
            }))
          }
          fullWidth
        />

        <TextField
          label="Declaration Date"
          type="date"
          value={
            form.declaration.declaration_date
              ? String(form.declaration.declaration_date).substring(0, 10)
              : ""
          }
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              declaration: {
                ...current.declaration,
                declaration_date: event.target.value,
              },
            }))
          }
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </JnfFormGrid>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
          Please read the placement and internship guidelines before proceeding with the declarations.
        </Typography>
        <Typography
          component="a"
          href="https://people.iitism.ac.in/~download/cdc/AIPC_Guidelines_2023.pdf"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setHasReadGuidelines(true)}
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: "medium",
            "&:hover": { color: "primary.dark" },
          }}
        >
          Read AIPC Guidelines & Recruiter Policy
        </Typography>
      </Box>

      <Stack spacing={1} sx={{ opacity: hasReadGuidelines ? 1 : 0.6 }}>
        {[
          {
            field: "aipc_guidelines_accepted",
            label: "AIPC guidelines — thoroughly read & agreed to abide during entire placement/internship process",
          },
          {
            field: "shortlisting_timeline_accepted",
            label: "Shortlisting criteria to be provided; final shortlist within 24–48 hours after written test",
          },
          {
            field: "posted_information_verified",
            label: "Information in posted profiles is verified & correct; no new clauses in final offer",
          },
          {
            field: "ranking_media_consent",
            label: "Consent to share company name, logo & email with national ranking agencies & media",
          },
          {
            field: "accuracy_terms_accepted",
            label: "Confirm accuracy of job profile; adhere to T&C; strict action in case of discrepancy",
          },
          {
            field: "rti_nirf_consent",
            label: "Results will be shared to CDC and not directly to students.",
          },
          {
            field: "information_confirmed",
            label: "I confirm that the information provided in this JNF is correct.",
          },
          {
            field: "authorization_confirmed",
            label: "I am authorised to submit this JNF on behalf of the company.",
          },
          {
            field: "policy_consent_confirmed",
            label: "I agree to the relevant placement and recruiter submission guidelines.",
          },
        ].map((item) => (
          <Box
            key={item.field}
            sx={{
              p: 1.5,
              border: "1px solid #e3f2fd",
              borderRadius: 1,
              "&:hover": { bgcolor: hasReadGuidelines ? "#f5faff" : "transparent" },
              display: "flex",
              alignItems: "center",
              cursor: hasReadGuidelines ? "default" : "not-allowed",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={(form.declaration as any)[item.field] ?? false}
                  disabled={!hasReadGuidelines}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      declaration: {
                        ...current.declaration,
                        [item.field]: event.target.checked,
                      },
                    }))
                  }
                />
              }
              label={
                <Typography variant="body2" sx={{ color: hasReadGuidelines ? "#455a64" : "#9e9e9e" }}>
                  {item.label}
                </Typography>
              }
              sx={{ m: 0, width: "100%", pointerEvents: hasReadGuidelines ? "auto" : "none" }}
            />
          </Box>
        ))}
      </Stack>

      <TextField
        label="Typed Signature"
        required
        placeholder="Type your full name as signature"
        value={form.declaration.typed_signature}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            declaration: {
              ...current.declaration,
              typed_signature: event.target.value,
            },
          }))
        }
        error={Boolean(fieldErrors["declaration.typed_signature"])}
        helperText={fieldErrors["declaration.typed_signature"]}
        fullWidth
      />
    </Stack>
  );

  if (embedded) {
    return content;
  }

  return (
    <SectionCard
      title="Declaration and Submit Readiness"
      description="Capture the authorised signatory and the required recruiter confirmations."
    >
      {content}
    </SectionCard>
  );
}
