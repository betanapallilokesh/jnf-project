import { matchIsValidTel } from "mui-tel-input";
import type {
  RecruiterRegisterFormErrors,
  RecruiterRegisterFormValues,
} from "../types";

export function isRecruiterRegisterEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateRecruiterRegisterForm(
  values: RecruiterRegisterFormValues
): RecruiterRegisterFormErrors {
  const errors: RecruiterRegisterFormErrors = {};
  const companyErrors: NonNullable<RecruiterRegisterFormErrors["company"]> = {};

  if (!values.full_name.trim()) {
    errors.full_name = "Full name is required.";
  }

  if (!values.designation.trim()) {
    errors.designation = "Designation is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Official email address is required.";
  } else if (!isRecruiterRegisterEmailValid(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.mobile_number.trim()) {
    errors.mobile_number = "Mobile number is required.";
  } else if (!matchIsValidTel(values.mobile_number)) {
    errors.mobile_number = "Please enter a valid phone number for the selected region.";
  }

  if (values.alternative_mobile.trim() && !matchIsValidTel(values.alternative_mobile)) {
    errors.alternative_mobile = "Please enter a valid phone number for the selected region.";
  }

  if (!values.otp_verified) {
    errors.otp_code = "Verify your email OTP before creating the account.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please confirm your password.";
  } else if (values.confirm_password !== values.password) {
    errors.confirm_password = "Passwords do not match.";
  }

  if (!values.company.name.trim()) {
    companyErrors.name = "Company name is required.";
  }

  if (
    values.company.employee_count.trim() !== "" &&
    Number.isNaN(Number(values.company.employee_count))
  ) {
    companyErrors.employee_count = "Employee count must be a number.";
  }

  if (
    values.company.annual_turnover.trim() !== "" &&
    Number.isNaN(Number(values.company.annual_turnover))
  ) {
    companyErrors.annual_turnover = "Annual turnover must be numeric.";
  }

  if (Object.keys(companyErrors).length > 0) {
    errors.company = companyErrors;
  }

  return errors;
}
