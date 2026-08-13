/* generated using openapi-typescript-codegen */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminProblemStatementService {
    public static getProblemStatements(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/problem-statements',
        });
    }

    public static createProblemStatement(requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/problem-statements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static updateProblemStatement(id: string, requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/problem-statements/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static deactivateProblemStatement(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/problem-statements/{id}',
            path: {
                'id': id,
            },
        });
    }
}
