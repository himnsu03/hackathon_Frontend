/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Standardized error response object
 */
export type ErrorResponseDto = {
    /**
     * HTTP Status code
     */
    status?: number;
    /**
     * Short error title or category
     */
    error?: string;
    /**
     * Detailed error message
     */
    message?: string;
    /**
     * Field-level validation error details, if applicable
     */
    details?: Array<string>;
    /**
     * Timestamp when error occurred
     */
    timestamp?: string;
};

