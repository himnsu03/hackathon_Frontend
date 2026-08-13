/* generated using openapi-typescript-codegen */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EvaluatorService {
    public static getSynopsesToEvaluate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/evaluator/synopsis',
        });
    }

    public static evaluateSynopsis(id: string, requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/evaluator/synopsis/{id}/evaluate',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static getHackathonSubmissionsToEvaluate(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/evaluator/hackathon-submissions',
        });
    }

    public static evaluateHackathonSubmission(id: string, requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/evaluator/hackathon-submissions/{id}/evaluate',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    public static getAssignedCandidates(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/evaluator/candidates',
        });
    }
}
