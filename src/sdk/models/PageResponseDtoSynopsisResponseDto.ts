/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SynopsisResponseDto } from './SynopsisResponseDto';
/**
 * Generic paginated wrapper for OpenAPI SDK generation
 */
export type PageResponseDtoSynopsisResponseDto = {
    /**
     * Page content items
     */
    content?: Array<SynopsisResponseDto>;
    /**
     * Current page index (0-indexed)
     */
    pageNumber?: number;
    /**
     * Page size
     */
    pageSize?: number;
    /**
     * Total number of elements across all pages
     */
    totalElements?: number;
    /**
     * Total number of pages
     */
    totalPages?: number;
    /**
     * Is this the last page
     */
    last?: boolean;
};

