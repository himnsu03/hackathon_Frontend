/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthStatusDto } from '../models/HealthStatusDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class HealthCheckService {
    /**
     * Get system health status
     * Returns service health status and current timestamp
     * @returns HealthStatusDto System is healthy
     * @throws ApiError
     */
    public static checkHealth(): CancelablePromise<HealthStatusDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/health',
        });
    }
}
