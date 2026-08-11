/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResponseDto } from './UserResponseDto';
/**
 * Authentication response with JWT token and user profile
 */
export type AuthResponseDto = {
    /**
     * JWT Bearer Token
     */
    token?: string;
    /**
     * Token type prefix
     */
    tokenType?: string;
    user?: UserResponseDto;
};

