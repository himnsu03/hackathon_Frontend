/* generated using openapi-typescript-codegen */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PublicProblemStatementService {
    public static getPublicProblemStatements(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/problem-statements',
        });
    }

    public static getProblemStatementByRef(ref: string): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/public/problem-statements/{ref}',
            path: {
                'ref': ref,
            },
        });
    }
}
