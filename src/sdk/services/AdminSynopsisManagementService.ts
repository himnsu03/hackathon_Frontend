/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminProjectSubmissionDto } from '../models/AdminProjectSubmissionDto';
import type { PageResponseDtoSynopsisResponseDto } from '../models/PageResponseDtoSynopsisResponseDto';
import type { SynopsisResponseDto } from '../models/SynopsisResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminSynopsisManagementService {
    /**
     * Shortlist synopsis
     * Shortlists a candidate synopsis and triggers automated email notification
     * @param id
     * @returns SynopsisResponseDto Synopsis shortlisted successfully
     * @throws ApiError
     */
    public static shortlistSynopsis(
        id: string,
    ): CancelablePromise<SynopsisResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/synopsis/{id}/shortlist',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden - requires ADMIN role`,
                404: `Synopsis not found`,
            },
        });
    }
    /**
     * Reject synopsis
     * Rejects a candidate synopsis proposal and notifies the candidate via email
     * @param id
     * @returns SynopsisResponseDto Synopsis rejected successfully
     * @throws ApiError
     */
    public static rejectSynopsis(
        id: string,
    ): CancelablePromise<SynopsisResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/synopsis/{id}/reject',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden - requires ADMIN role`,
                404: `Synopsis not found`,
            },
        });
    }
    /**
     * Get synopses by status
     * Retrieves a paginated list of candidate synopsis submissions filtered by status
     * @param status
     * @param page
     * @param size
     * @returns PageResponseDtoSynopsisResponseDto Paginated synopsis list retrieved successfully
     * @throws ApiError
     */
    public static getSubmissions(
        status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' = 'PENDING',
        page?: number,
        size: number = 10,
    ): CancelablePromise<PageResponseDtoSynopsisResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/synopsis',
            query: {
                'status': status,
                'page': page,
                'size': size,
            },
            errors: {
                403: `Forbidden - requires ADMIN role`,
            },
        });
    }
    /**
     * Get all final project submissions
     * Retrieves a list of candidate GitHub repository and live app URLs submitted during hackathon
     * @returns AdminProjectSubmissionDto OK
     * @throws ApiError
     */
    public static getAllProjectSubmissions(): CancelablePromise<Array<AdminProjectSubmissionDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/synopsis/projects',
        });
    }
}
