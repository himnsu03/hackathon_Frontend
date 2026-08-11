/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Synopsis submission response object
 */
export type SynopsisResponseDto = {
    /**
     * Synopsis ID
     */
    id?: string;
    /**
     * User ID
     */
    userId?: string;
    /**
     * Candidate name
     */
    candidateName?: string;
    /**
     * Candidate submission ID
     */
    submissionId?: string;
    /**
     * Problem statement reference
     */
    problemStatementRef?: string;
    /**
     * Synopsis content
     */
    content?: string;
    /**
     * Synopsis status
     */
    status?: SynopsisResponseDto.status;
    /**
     * Submission timestamp
     */
    submittedAt?: string;
    /**
     * Review timestamp, if reviewed
     */
    reviewedAt?: string;
};
export namespace SynopsisResponseDto {
    /**
     * Synopsis status
     */
    export enum status {
        PENDING = 'PENDING',
        SHORTLISTED = 'SHORTLISTED',
        REJECTED = 'REJECTED',
    }
}

