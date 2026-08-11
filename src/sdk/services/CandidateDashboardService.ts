/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CandidateDashboardDto } from '../models/CandidateDashboardDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CandidateDashboardService {
    /**
     * Get candidate dashboard
     * Retrieves aggregated profile, synopsis status, and hackathon eligibility status
     * @returns CandidateDashboardDto Dashboard loaded successfully
     * @throws ApiError
     */
    public static getDashboard(): CancelablePromise<CandidateDashboardDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/candidate/dashboard',
            errors: {
                401: `Unauthorized - JWT token missing or invalid`,
            },
        });
    }
}
