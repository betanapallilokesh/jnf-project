<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\SendOtpRequest;
use App\Http\Requests\Auth\VerifyOtpRequest;
use App\Services\Auth\OtpService;
use App\Services\Auth\RecruiterAuthService;
use App\Services\Auth\RecruiterSessionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(
        private readonly OtpService $otpService,
        private readonly RecruiterAuthService $recruiterAuthService,
        private readonly RecruiterSessionService $recruiterSessionService
    ) {
    }

    public function sendOtp(SendOtpRequest $request): JsonResponse
    {
        \Illuminate\Support\Facades\Log::info("OTP Request received for: " . $request->string('recruiter_email'));
        $otpData = $this->otpService->generate(
            $request->string('recruiter_email')->toString()
        );

        return $this->api()->success($otpData);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $verificationData = $this->otpService->verify(
            $request->string('recruiter_email')->toString(),
            $request->string('otp_code')->toString()
        );

        return $this->api()->success($verificationData);
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $registrationData = $this->recruiterAuthService->register(
            $request->validated()
        );

        return $this->api()->created($registrationData);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $loginData = $this->recruiterAuthService->login(
            $request->validated()
        );

        return $this->api()->success($loginData);
    }

    public function me(Request $request): JsonResponse
    {
        $sessionData = $this->recruiterSessionService->me($request->user());

        return $this->api()->success($sessionData);
    }

    public function logout(Request $request): JsonResponse
    {
        $logoutData = $this->recruiterSessionService->logout($request->user());

        return $this->api()->success($logoutData);
    }
}