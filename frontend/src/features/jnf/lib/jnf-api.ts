import { fetchJson, type JsonObject } from "@/lib/fetch-json";

export type BackendJnfCore = {
  id: number;
  company_id: number;
  created_by: number;
  reviewed_by: number | null;
  jnf_number: string | null;
  recruitment_season: string | null;
  job_title: string;
  job_designation: string | null;
  place_of_posting: string | null;
  work_location_mode: string | null;
  expected_hires: number | null;
  minimum_hires: number | null;
  tentative_joining_month: string | null;
  job_description_html: string | null;
  additional_job_info: string | null;
  bond_details: string | null;
  registration_link: string | null;
  onboarding_procedure: string | null;
  jd_pdf_path: string | null;
  status: string;
  preview_completed: boolean;
  submitted_at: string | null;
  reviewed_at: string | null;
  review_notes: string | null;
  created_at: string;
  updated_at: string;
  contacts?: BackendJnfContact[];
  eligibility_rule?: BackendJnfEligibilityResponse['eligibility_rule'];
  salary_packages?: BackendJnfSalaryPackage[];
  selection_rounds?: BackendJnfRound[];
  declaration?: BackendJnfDeclaration;
  eligible_programmes?: BackendJnfEligibleProgramme[];
  eligible_disciplines?: BackendJnfEligibleDiscipline[];
};

export type BackendJnfContact = {
  id: number;
  jnf_id: number;
  contact_type: string;
  full_name: string;
  designation: string | null;
  email: string;
  mobile_number: string | null;
  landline: string | null;
  preferred_contact_method: string | null;
  remarks: string | null;
  is_optional: boolean;
  created_at: string;
  updated_at: string;
};

export type BackendJnfEligibleProgramme = {
  id: number;
  jnf_id: number;
  programme_id: number;
  is_eligible: boolean;
  min_cpi_for_programme: number | null;
};

export type BackendJnfEligibleDiscipline = {
  id: number;
  jnf_id: number;
  programme_id: number;
  discipline_id: number;
  is_eligible: boolean;
  min_cpi_for_discipline: number | null;
};

export type BackendJnfEligibilityResponse = {
  jnf_id: number;
  eligibility_rule: {
    minimum_cgpa: number | null;
    backlogs_allowed: boolean;
    max_backlogs: number | null;
    high_school_percentage_criterion: number | null;
    gender_filter: string;
    gap_year_allowed: boolean;
    history_of_arrears_allowed: boolean;
    phd_allowed: boolean;
    phd_department_requirement: string | null;
    slp_requirement: string | null;
    ma_dhss_allowed: boolean;
    other_specific_requirements: string | null;
  } | null;
  programme_rows: BackendJnfEligibleProgramme[];
  discipline_rows: BackendJnfEligibleDiscipline[];
};

export type BackendJnfSalaryPackage = {
  id: number;
  jnf_id: number;
  programme_id: number | null;
  salary_structure_mode: string | null;
  currency: string | null;
  ctc: number | null;
  base_salary: number | null;
  variable_pay: number | null;
  joining_bonus: number | null;
  retention_bonus: number | null;
  performance_bonus: number | null;
  esops: number | null;
  stipend: number | null;
  ctc_annual: number | null;
  base_fixed: number | null;
  monthly_take_home: number | null;
  gross_salary: number | null;
  first_year_ctc: number | null;
  stocks_options: string | null;
  esops_value: number | null;
  esops_vest_period: string | null;
  bond_amount: number | null;
  bond_duration_months: number | null;
  deductions_text: string | null;
  ctc_breakup_text: string | null;
  created_at: string;
  updated_at: string;
  components?: BackendJnfSalaryComponent[];
};

export type BackendJnfSalaryComponent = {
  id: number;
  salary_package_id: number;
  component_type: string;
  component_label: string;
  amount: number;
  currency: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type BackendJnfRound = {
  id: number;
  jnf_id: number;
  round_category: string;
  round_order: number;
  round_name: string;
  selection_mode: string | null;
  interview_mode: string | null;
  test_type: string | null;
  duration_minutes: number | null;
  team_members_required: number | null;
  rooms_required: number | null;
  other_screening_notes: string | null;
  is_enabled: boolean;
  is_pre_offer_mandatory: boolean;
  created_at: string;
  updated_at: string;
};

export type BackendJnfDeclaration = {
  id: number;
  jnf_id: number;
  aipc_guidelines_accepted: boolean;
  shortlisting_timeline_accepted: boolean;
  posted_information_verified: boolean;
  ranking_media_consent: boolean;
  accuracy_terms_accepted: boolean;
  rti_nirf_consent: boolean;
  information_confirmed: boolean;
  authorization_confirmed: boolean;
  policy_consent_confirmed: boolean;
  authorised_signatory_name: string | null;
  authorised_signatory_designation: string | null;
  authorised_signatory_email: string | null;
  authorised_signatory_phone: string | null;
  declaration_place: string | null;
  declaration_date: string | null;
  typed_signature: string | null;
  preview_confirmed: boolean;
  email_confirmation_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

type ListJnfsResponse = {
  filters: Record<string, string | null>;
  jnfs: BackendJnfCore[];
};

type JnfCoreResponse = {
  jnf: BackendJnfCore;
};

type NoContent = Record<string, never>;

export async function listJnfs(params?: {
  status?: string;
  recruitment_season?: string;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.status) searchParams.set("status", params.status);
  if (params?.recruitment_season) searchParams.set("recruitment_season", params.recruitment_season);
  if (params?.search) searchParams.set("search", params.search);

  const query = searchParams.toString();
  return fetchJson<ListJnfsResponse>(`/jnfs${query ? `?${query}` : ""}`, { method: "GET" });
}

export async function getJnfCore(jnfId: string | number) {
  return fetchJson<JnfCoreResponse>(`/jnfs/${jnfId}`, { method: "GET" });
}

export async function createJnfCore(payload: JsonObject) {
  return fetchJson<JnfCoreResponse>("/jnfs", { method: "POST", body: payload });
}

export async function updateJnfCore(jnfId: string | number, payload: JsonObject) {
  return fetchJson<JnfCoreResponse>(`/jnfs/${jnfId}`, { method: "PUT", body: payload });
}

export async function deleteJnfCore(jnfId: string | number) {
  return fetchJson<NoContent>(`/jnfs/${jnfId}`, { method: "DELETE" });
}

export async function submitJnf(jnfId: string | number) {
  return fetchJson<JnfCoreResponse>(`/jnfs/${jnfId}/submit`, { method: "POST" });
}

export async function uploadJdPdf(file: File) {
  const formData = new FormData();
  formData.append("jd_pdf", file);

  const response = await fetchJson<{ jd_pdf_path: string }>("/jnfs/upload-jd-pdf", {
    method: "POST",
    body: formData,
  });

  if (!response.data) throw new Error("Failed to upload JD PDF");
  return response.data;
}

export type JdParsedData = {
  job_title: string | null;
  job_designation: string | null;
  place_of_posting: string | null;
  work_location_mode: string | null;
  expected_hires: number | null;
  minimum_hires: number | null;
  tentative_joining_month: string | null;
  ctc_annual: number | null;
  base_fixed: number | null;
  minimum_cgpa: number | null;
};

export async function importJdWithAi(file: File) {
  const formData = new FormData();
  formData.append("jd_pdf", file);

  const response = await fetchJson<JdParsedData>("/jnfs/import-jd", {
    method: "POST",
    body: formData,
  });

  if (!response.data) throw new Error("Failed to parse JD PDF via AI");
  return response.data;
}

export async function getSkillsCatalog() {
  return fetchJson<{ skills: Array<{ id: number; label: string }> }>("/jnfs/skills", { method: "GET" });
}
