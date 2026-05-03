<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateRecruiterStatusRequest;
use App\Services\Admin\AdminRecruiterService;
use Illuminate\Http\JsonResponse;

class AdminRecruiterController extends Controller
{
    public function __construct(
        private readonly AdminRecruiterService $adminRecruiterService
    ) {
    }

    public function index(): JsonResponse
    {
        return $this->api()->success(
            $this->adminRecruiterService->list()
        );
    }

    public function updateStatus(
        UpdateRecruiterStatusRequest $request,
        int $recruiter
    ): JsonResponse {
        return $this->api()->success(
            $this->adminRecruiterService->updateStatus(
                $recruiter,
                $request->validated()
            )
        );
    }

    public function destroy(int $recruiter): JsonResponse
    {
        return $this->api()->success(
            $this->adminRecruiterService->destroy($recruiter)
        );
    }
}