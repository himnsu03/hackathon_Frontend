/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PublicResultResponseDto } from '../models/PublicResultResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PublicResultsService {
    /**
     * Get declared hackathon results
     * Publicly retrieves list of winners and positions without leaking private PII
     * @returns PublicResultResponseDto Results retrieved successfully
     * @throws ApiError
     */
    public static getResults(): CancelablePromise<Array<PublicResultResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/results',
        });
    }
}
