/* generated using openapi-typescript-codegen */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdminHackathonConfigService {
    public static getConfig(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/admin/hackathon-config',
        });
    }

    public static updateConfig(requestBody: any): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/admin/hackathon-config',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
