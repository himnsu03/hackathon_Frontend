/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HackathonStartResponseDto } from '../models/HackathonStartResponseDto';
import type { HackathonStatusResponseDto } from '../models/HackathonStatusResponseDto';
import type { HackathonSubmitDto } from '../models/HackathonSubmitDto';
import type { ProblemStatementResponseDto } from '../models/ProblemStatementResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HackathonCoreService {
    /**
     * Submit hackathon assignment
     * Submits GitHub repository URL and optional live app URL. Server validates deadline on every request
     * @param requestBody
     * @returns HackathonStatusResponseDto Hackathon assignment submitted successfully
     * @throws ApiError
     */
    public static submitHackathon(
        requestBody: HackathonSubmitDto,
    ): CancelablePromise<HackathonStatusResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/hackathon/submit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation failure or hackathon not started`,
                422: `Unprocessable Entity - Deadline has passed and submission is locked`,
            },
        });
    }
    /**
     * Start hackathon timer
     * Starts the server-enforced hackathon timer. Idempotent: returns existing start time & deadline if already started
     * @returns HackathonStartResponseDto Hackathon timer started / active timer returned
     * @throws ApiError
     */
    public static startHackathon(): CancelablePromise<HackathonStartResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/hackathon/start',
            errors: {
                403: `Forbidden - Synopsis not shortlisted`,
            },
        });
    }
    /**
     * Get hackathon submission status
     * Retrieves current status, remaining timer seconds, and submitted links
     * @returns HackathonStatusResponseDto Status retrieved successfully
     * @throws ApiError
     */
    public static getStatus(): CancelablePromise<HackathonStatusResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/hackathon/status',
        });
    }
    /**
     * Get hackathon problem statement
     * Retrieves the assignment problem statement. Accessible only if candidate synopsis status is SHORTLISTED
     * @returns ProblemStatementResponseDto Problem statement retrieved successfully
     * @throws ApiError
     */
    public static getProblemStatement(): CancelablePromise<ProblemStatementResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/hackathon/problem-statement',
            errors: {
                403: `Forbidden - Synopsis not shortlisted`,
            },
        });
    }
}
