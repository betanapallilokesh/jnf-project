<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\AdminGeneralService;
use Illuminate\Http\JsonResponse;

class AdminGeneralController extends Controller
{
    public function __construct(
        private readonly AdminGeneralService $adminGeneralService
    ) {
    }

    public function companies(): JsonResponse
    {
        return $this->api()->success(
            $this->adminGeneralService->listCompanies()
        );
    }

    public function activities(): JsonResponse
    {
        return $this->api()->success(
            $this->adminGeneralService->listActivities()
        );
    }

    public function notifications(): JsonResponse
    {
        return $this->api()->success(
            $this->adminGeneralService->listNotifications()
        );
    }

    public function destroyCompany(int $company): JsonResponse
    {
        return $this->api()->success(
            $this->adminGeneralService->deleteCompany($company)
        );
    }
}
