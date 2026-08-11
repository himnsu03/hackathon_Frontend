/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SynopsisResponseDto } from './SynopsisResponseDto';
import type { UserResponseDto } from './UserResponseDto';
/**
 * Aggregated dashboard view for candidates
 */
export type CandidateDashboardDto = {
    user?: UserResponseDto;
    synopsis?: SynopsisResponseDto;
    /**
     * Hackathon submission status
     */
    hackathonStatus?: string;
    /**
     * Is candidate eligible to start hackathon
     */
    eligibleToStart?: boolean;
};

