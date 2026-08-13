/* generated using openapi-typescript-codegen */
import type { SynopsisAiCriteriaDto } from '../models/SynopsisAiCriteriaDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SynopsisAiEvaluationCriteriaService {
    public static createCriteria(
        requestBody: SynopsisAiCriteriaDto,
    ): CancelablePromise<SynopsisAiCriteriaDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/synopsis-ai-criteria',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - requires ADMIN role`,
            },
        });
    }

    public static updateCriteria(
        id: string,
        requestBody: SynopsisAiCriteriaDto,
    ): CancelablePromise<SynopsisAiCriteriaDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/synopsis-ai-criteria/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - requires ADMIN role`,
            },
        });
    }

    public static deleteCriteria(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/synopsis-ai-criteria/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Forbidden - requires ADMIN role`,
            },
        });
    }

    public static getAllCriteria(
        hackathonConfigId: number = 1,
    ): CancelablePromise<Array<SynopsisAiCriteriaDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/synopsis-ai-criteria',
            query: {
                'hackathonConfigId': hackathonConfigId,
            },
        });
    }

    public static getApplicableCriteria(
        hackathonConfigId: number = 1,
        problemStatementRef?: string,
    ): CancelablePromise<Array<SynopsisAiCriteriaDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/synopsis-ai-criteria',
            query: {
                'hackathonConfigId': hackathonConfigId,
                'problemStatementRef': problemStatementRef,
            },
        });
    }
}
