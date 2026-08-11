/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SynopsisResponseDto } from '../models/SynopsisResponseDto';
import type { SynopsisSubmitDto } from '../models/SynopsisSubmitDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CandidateSynopsisService {
    /**
     * Submit project synopsis
     * Submits a single project synopsis proposal for evaluation
     * @param requestBody
     * @returns SynopsisResponseDto Synopsis submitted successfully
     * @throws ApiError
     */
    public static submitSynopsis(
        requestBody: SynopsisSubmitDto,
    ): CancelablePromise<SynopsisResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/synopsis/submit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                409: `Conflict - candidate already submitted a synopsis`,
            },
        });
    }
    /**
     * Get synopsis status
     * Checks the current review status of the candidate's synopsis
     * @returns SynopsisResponseDto Synopsis status retrieved successfully
     * @throws ApiError
     */
    public static getSynopsisStatus(): CancelablePromise<SynopsisResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/synopsis/status',
            errors: {
                404: `No synopsis found for candidate`,
            },
        });
    }
}
