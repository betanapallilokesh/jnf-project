<?php

namespace App\Services\Admin;

use App\Models\Recruiter;

class AdminRecruiterService
{
    public function list(): array
    {
        $recruiters = Recruiter::with('company')->orderBy('created_at', 'desc')->get();

        return [
            'recruiters' => $recruiters->map(function ($r) {
                return [
                    'id' => $r->id,
                    'full_name' => $r->full_name,
                    'email' => $r->email,
                    'status' => $r->status,
                    'company_name' => $r->company ? $r->company->name : null,
                ];
            })->toArray(),
        ];
    }

    public function updateStatus(int $recruiterId, array $payload): array
    {
        $recruiter = Recruiter::findOrFail($recruiterId);
        $recruiter->update(['status' => $payload['status']]);

        return [
            'recruiter' => $recruiter->fresh()->toArray(),
        ];
    }

    public function destroy(int $recruiterId): array
    {
        $recruiter = Recruiter::findOrFail($recruiterId);
        $recruiter->delete();

        return [
            'message' => 'Recruiter and all associated records deleted successfully.',
        ];
    }
}
