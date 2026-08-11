/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Publicly viewable result record (strictly contains no PII like email or phone)
 */
export type PublicResultResponseDto = {
    /**
     * Candidate name
     */
    name?: string;
    /**
     * Candidate unique submission ID
     */
    submissionId?: string;
    /**
     * Hackathon position awarded
     */
    position?: PublicResultResponseDto.position;
    /**
     * Timestamp when result was declared
     */
    declaredAt?: string;
};
export namespace PublicResultResponseDto {
    /**
     * Hackathon position awarded
     */
    export enum position {
        FIRST = 'FIRST',
        SECOND = 'SECOND',
        THIRD = 'THIRD',
        CONSOLATION = 'CONSOLATION',
    }
}

