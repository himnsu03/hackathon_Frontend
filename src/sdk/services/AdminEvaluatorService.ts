/* generated using openapi-typescript-codegen */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminEvaluatorService {
    public static getEvaluators(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/evaluators',
        });
    }

    public static addEvaluator(requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/admin/evaluators',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static revokeEvaluator(id: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/admin/evaluators/{id}',
            path: {
                'id': id,
            },
        });
    }
}
