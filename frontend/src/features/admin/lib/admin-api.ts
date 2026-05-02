import { fetchJson } from "@/lib/fetch-json";
import type { JnfRecord } from "@/features/jnf/types";
import { type BackendJnfCore } from "@/features/jnf/lib/jnf-api";
import {
  mapBackendContactsToRecord,
  mapBackendDeclarationToRecord,
  mapBackendRoundsToRecord,
  mapBackendSalaryToRecord,
  mapEligibilityResponseToRecord,
  mapBackendJnfCoreToRecord,
} from "@/features/jnf/lib/jnf-mappers";

export type AdminJnfOverview = {
  id: string;
  companyName: string;
  recruiterId: string;
  recruiterName: string;
  jobTitle: string;
  roleType: string;
  submittedAt: string;
  status: string;
};

export type AdminDashboardStats = {
  totalRecruiters: number;
  totalCompanies: number;
  totalJnfsSubmitted: number;
  approvedJnfs: number;
  pendingJnfs: number;
};

export type AdminRecruiterOverview = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  companyName: string | null;
};

export type AdminCompanyOverview = {
  id: string;
  name: string;
  sector: string | null;
  website: string | null;
  recruiterCount: number;
  jnfCount: number;
  createdAt: string;
};

export type AdminActivityRow = {
  id: string;
  action: string;
  remarks: string | null;
  jnfId: number | null;
  companyName: string;
  actorName: string;
  createdAt: string;
};

export type AdminNotificationRow = {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
};

export async function listAdminJnfs() {
  const response = await fetchJson<{ jnfs: Record<string, unknown>[] }>("/admin/jnfs", {
    method: "GET",
  });

  return response.data.jnfs.map(
    (item: Record<string, unknown>): AdminJnfOverview => ({
      id: String(item.id),
      companyName: (item.company as Record<string, string>)?.name || "Unknown Company",
      recruiterId: String(item.created_by),
      recruiterName: (item.creator as Record<string, string>)?.full_name || "Unknown",
      jobTitle: item.job_title as string,
      roleType: (item.role_type as string) || "N/A",
      submittedAt: (item.submitted_at as string) || (item.created_at as string),
      status: item.status as string,
    })
  );
}

export async function getAdminJnf(id: string): Promise<JnfRecord> {
  const response = await fetchJson<{ jnf: BackendJnfCore }>(`/admin/jnfs/${id}`, {
    method: "GET",
  });
  
  const data = response.data.jnf;
  const coreFields = mapBackendJnfCoreToRecord(data);

  return {
    ...coreFields,
    contacts: data.contacts ? mapBackendContactsToRecord(data.contacts) : [],
    eligibility: data.eligibility_rule 
      ? mapEligibilityResponseToRecord({ 
          jnf_id: Number(id), 
          eligibility_rule: data.eligibility_rule, 
          programme_rows: data.eligible_programmes ?? [], 
          discipline_rows: data.eligible_disciplines ?? [] 
        })
      : mapEligibilityResponseToRecord({ 
          jnf_id: Number(id), 
          eligibility_rule: null, 
          programme_rows: [], 
          discipline_rows: [] 
        }),
    salary_details: data.salary_packages ? mapBackendSalaryToRecord(data.salary_packages) : mapBackendSalaryToRecord([]),
    selection_process: {
      ...coreFields.selection_process,
      rounds: data.selection_rounds ? mapBackendRoundsToRecord(data.selection_rounds) : [],
    },
    declaration: mapBackendDeclarationToRecord(data.declaration ?? null),
  };
}

export async function getAdminDashboardData() {
  const response = await fetchJson<{
    stats: {
      total_recruiters: number;
      total_companies: number;
      total_jnfs: number;
      approved_jnfs: number;
      pending_jnfs: number;
    };
  }>("/admin/dashboard", {
    method: "GET",
  });

  const { stats } = response.data;
  return {
    totalRecruiters: stats.total_recruiters,
    totalCompanies: stats.total_companies,
    totalJnfsSubmitted: stats.total_jnfs,
    approvedJnfs: stats.approved_jnfs,
    pendingJnfs: stats.pending_jnfs,
  } as AdminDashboardStats;
}

export async function listAdminRecruiters() {
  const response = await fetchJson<{
    recruiters: Array<{
      id: number;
      full_name: string;
      email: string;
      status: string;
      company_name: string | null;
    }>;
  }>("/admin/recruiters", {
    method: "GET",
  });

  return response.data.recruiters.map(
    (r): AdminRecruiterOverview => ({
      id: String(r.id),
      fullName: r.full_name,
      email: r.email,
      status: r.status,
      companyName: r.company_name,
    })
  );
}

export async function listAdminCompanies() {
  const response = await fetchJson<{
    companies: Array<{
      id: number;
      name: string;
      sector: string | null;
      website: string | null;
      recruiter_count: number;
      jnf_count: number;
      created_at: string;
    }>;
  }>("/admin/companies", {
    method: "GET",
  });

  return response.data.companies.map(
    (c): AdminCompanyOverview => ({
      id: String(c.id),
      name: c.name,
      sector: c.sector,
      website: c.website,
      recruiterCount: c.recruiter_count,
      jnfCount: c.jnf_count,
      createdAt: c.created_at,
    })
  );
}

export async function listAdminActivities() {
  const response = await fetchJson<{
    activities: Array<{
      id: number;
      action: string;
      remarks: string | null;
      jnf_id: number | null;
      company_name: string;
      actor_name: string;
      created_at: string;
    }>;
  }>("/admin/activities", {
    method: "GET",
  });

  return response.data.activities.map(
    (a): AdminActivityRow => ({
      id: String(a.id),
      action: a.action,
      remarks: a.remarks,
      jnfId: a.jnf_id,
      companyName: a.company_name,
      actorName: a.actor_name,
      createdAt: a.created_at,
    })
  );
}

export async function listAdminNotifications() {
  const response = await fetchJson<{
    notifications: Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      created_at: string;
    }>;
  }>("/admin/notifications", {
    method: "GET",
  });

  return response.data.notifications.map(
    (n): AdminNotificationRow => ({
      id: String(n.id),
      title: n.title,
      message: n.message,
      type: n.type,
      createdAt: n.created_at,
    })
  );
}

export async function approveJnf(jnfId: string, notes?: string) {
  return fetchJson<{ message: string }>(`/admin/jnfs/${jnfId}/approve`, {
    method: "POST",
    body: { notes: notes || null },
  });
}

export async function requestChangesJnf(jnfId: string, notes: string) {
  return fetchJson<{ message: string }>(`/admin/jnfs/${jnfId}/request-changes`, {
    method: "POST",
    body: { notes },
  });
}

export async function closeJnf(jnfId: string, notes: string) {
  return fetchJson<{ message: string }>(`/admin/jnfs/${jnfId}/close`, {
    method: "POST",
    body: { notes },
  });
}

export async function deleteAdminCompany(companyId: string) {
  return fetchJson<{ message: string }>(`/admin/companies/${companyId}`, {
    method: "DELETE",
  });
}

export async function deleteAdminRecruiter(recruiterId: string) {
  return fetchJson<{ message: string }>(`/admin/recruiters/${recruiterId}`, {
    method: "DELETE",
  });
}
