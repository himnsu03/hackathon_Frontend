/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeclareResultDto } from '../models/DeclareResultDto';
import type { PublicResultResponseDto } from '../models/PublicResultResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminResultManagementService {
    /**
     * Declare winner result
     * Declares winner or position for a candidate via submission ID
     * @param requestBody
     * @returns PublicResultResponseDto Result declared successfully
     * @throws ApiError
     */
    public static declareResult(
        requestBody: DeclareResultDto,
    ): CancelablePromise<PublicResultResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/results/declare',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - requires ADMIN role`,
                404: `Candidate submission ID not found`,
            },
        });
    }
}
