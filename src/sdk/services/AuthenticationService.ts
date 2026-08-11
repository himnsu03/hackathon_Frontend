/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AuthResponseDto } from '../models/AuthResponseDto';
import type { LoginRequestDto } from '../models/LoginRequestDto';
import type { RegisterRequestDto } from '../models/RegisterRequestDto';
import type { UserResponseDto } from '../models/UserResponseDto';
import type { VerifyEmailRequestDto } from '../models/VerifyEmailRequestDto';
import type { VerifyMobileRequestDto } from '../models/VerifyMobileRequestDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthenticationService {
    /**
     * Verify mobile number
     * Verifies candidate's mobile number using OTP/token
     * @param requestBody
     * @returns any Mobile verified successfully
     * @throws ApiError
     */
    public static verifyMobile(
        requestBody: VerifyMobileRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/verify-mobile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token`,
            },
        });
    }
    /**
     * Verify email address
     * Verifies candidate's email using token sent to email
     * @param requestBody
     * @returns any Email verified successfully
     * @throws ApiError
     */
    public static verifyEmail(
        requestBody: VerifyEmailRequestDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/verify-email',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid or expired token`,
            },
        });
    }
    /**
     * Register candidate
     * Creates a candidate account and generates a unique submission ID (HACK-2026-XXXXX)
     * @param requestBody
     * @returns AuthResponseDto User registered successfully
     * @throws ApiError
     */
    public static register(
        requestBody: RegisterRequestDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure`,
                409: `Email already registered`,
            },
        });
    }
    /**
     * User login
     * Authenticates user via email and OTP/password, returning JWT Bearer token
     * @param requestBody
     * @returns AuthResponseDto Login successful
     * @throws ApiError
     */
    public static login(
        requestBody: LoginRequestDto,
    ): CancelablePromise<AuthResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Get current user profile
     * Returns detailed profile of currently authenticated user
     * @returns UserResponseDto User profile retrieved successfully
     * @throws ApiError
     */
    public static getMe(): CancelablePromise<UserResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
            errors: {
                401: `Unauthorized - Bearer token missing or invalid`,
            },
        });
    }
}
