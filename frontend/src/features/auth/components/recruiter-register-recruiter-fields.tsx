import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import type {
  RecruiterRegisterFormErrors,
  RecruiterRegisterFormValues,
} from "../types";
import RecruiterRegisterFormGrid from "./recruiter-register-form-grid";

type RecruiterRegisterRecruiterFieldsProps = Readonly<{
  form: RecruiterRegisterFormValues;
  errors: RecruiterRegisterFormErrors;
  onFieldChange: <K extends keyof RecruiterRegisterFormValues>(
    field: K,
    value: RecruiterRegisterFormValues[K]
  ) => void;
}>;

export default function RecruiterRegisterRecruiterFields({
  form,
  errors,
  onFieldChange,
}: RecruiterRegisterRecruiterFieldsProps) {
  const [touchedMobile, setTouchedMobile] = useState(false);
  const [touchedAltMobile, setTouchedAltMobile] = useState(false);

  const mobileError =
    errors.mobile_number ||
    (touchedMobile && !matchIsValidTel(form.mobile_number)
      ? "Please enter a valid phone number for the selected region."
      : "");

  const altMobileError =
    errors.alternative_mobile ||
    (touchedAltMobile &&
    form.alternative_mobile &&
    !matchIsValidTel(form.alternative_mobile)
      ? "Please enter a valid phone number for the selected region."
      : "");

  return (
    <Stack spacing={2}>
      <Typography variant="h6">Recruiter Details</Typography>

      <RecruiterRegisterFormGrid>
        <TextField
          label="Full Name"
          required
          value={form.full_name}
          onChange={(event) => onFieldChange("full_name", event.target.value)}
          error={Boolean(errors.full_name)}
          helperText={errors.full_name}
          fullWidth
        />

        <TextField
          label="Designation"
          required
          value={form.designation}
          onChange={(event) => onFieldChange("designation", event.target.value)}
          error={Boolean(errors.designation)}
          helperText={errors.designation}
          fullWidth
        />

        <TextField
          label="Official Email Address"
          type="email"
          required
          value={form.email}
          onChange={(event) => onFieldChange("email", event.target.value)}
          error={Boolean(errors.email)}
          helperText={errors.email}
          fullWidth
        />

        <MuiTelInput
          label="Mobile Number"
          required
          value={form.mobile_number}
          onChange={(value) => onFieldChange("mobile_number", value)}
          onBlur={() => setTouchedMobile(true)}
          error={Boolean(mobileError)}
          helperText={mobileError}
          fullWidth
          defaultCountry="IN"
        />

        <MuiTelInput
          label="Alternative Mobile Number"
          value={form.alternative_mobile}
          onChange={(value) => onFieldChange("alternative_mobile", value)}
          onBlur={() => setTouchedAltMobile(true)}
          error={Boolean(altMobileError)}
          helperText={altMobileError}
          fullWidth
          defaultCountry="IN"
        />

        <Box />
      </RecruiterRegisterFormGrid>
    </Stack>
  );
}
