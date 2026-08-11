/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Detailed status of hackathon attempt
 */
export type HackathonStatusResponseDto = {
    /**
     * Assignment start time
     */
    assignmentStartTime?: string;
    /**
     * Final submission time if submitted
     */
    submissionTime?: string;
    /**
     * Server-enforced deadline
     */
    deadline?: string;
    /**
     * GitHub repository URL
     */
    githubRepoUrl?: string;
    /**
     * Live application URL
     */
    liveAppUrl?: string;
    /**
     * Whether submission is locked against changes
     */
    locked?: boolean;
    /**
     * Current status
     */
    status?: HackathonStatusResponseDto.status;
    /**
     * Remaining seconds until deadline
     */
    remainingSeconds?: number;
};
export namespace HackathonStatusResponseDto {
    /**
     * Current status
     */
    export enum status {
        NOT_STARTED = 'NOT_STARTED',
        IN_PROGRESS = 'IN_PROGRESS',
        SUBMITTED = 'SUBMITTED',
        LOCKED = 'LOCKED',
    }
}

