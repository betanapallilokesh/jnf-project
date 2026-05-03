<?php

namespace App\Services\Admin;

use App\Models\Company;
use App\Models\JnfAuditLog;
use App\Models\Recruiter;

class AdminGeneralService
{
    public function listCompanies(): array
    {
        $companies = Company::withCount(['recruiters', 'jnfs'])
            ->orderBy('name')
            ->get();

        return [
            'companies' => $companies->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'sector' => $c->sector,
                    'website' => $c->website,
                    'recruiter_count' => $c->recruiters_count,
                    'jnf_count' => $c->jnfs_count,
                    'created_at' => $c->created_at,
                ];
            })->toArray()
        ];
    }

    public function listActivities(): array
    {
        // Fetch recent JNF audit logs as "Activity"
        $logs = JnfAuditLog::with(['jnf.company', 'actor'])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return [
            'activities' => $logs->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'remarks' => $log->remarks,
                    'jnf_id' => $log->jnf_id,
                    'company_name' => $log->jnf->company->name ?? 'Unknown',
                    'actor_name' => $log->actor_name ?? 'System',
                    'created_at' => $log->created_at,
                ];
            })->toArray()
        ];
    }

    public function listNotifications(): array
    {
        // For now, return a list of pending JNFs as "Notifications"
        $pendingJnfs = \App\Models\Jnf::where('status', \App\Enums\JnfStatus::Submitted->value)
            ->with('company')
            ->orderBy('submitted_at', 'desc')
            ->get();

        return [
            'notifications' => $pendingJnfs->map(function ($j) {
                return [
                    'id' => $j->id,
                    'title' => 'New JNF Submitted',
                    'message' => "{$j->company->name} submitted a new JNF: {$j->job_title}",
                    'type' => 'info',
                    'created_at' => $j->submitted_at,
                ];
            })->toArray()
        ];
    }

    public function deleteCompany(int $companyId): array
    {
        $company = Company::findOrFail($companyId);
        $company->delete();

        return [
            'message' => 'Company and all associated records deleted successfully.',
        ];
    }
}
