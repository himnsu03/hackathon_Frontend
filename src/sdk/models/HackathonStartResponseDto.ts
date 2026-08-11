/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Response returned when candidate starts hackathon timer
 */
export type HackathonStartResponseDto = {
    /**
     * Server-generated start timestamp
     */
    assignmentStartTime?: string;
    /**
     * Server-calculated immutable deadline timestamp
     */
    deadline?: string;
    /**
     * Current submission status
     */
    status?: HackathonStartResponseDto.status;
    /**
     * Assigned hackathon duration in hours
     */
    durationHours?: number;
};
export namespace HackathonStartResponseDto {
    /**
     * Current submission status
     */
    export enum status {
        NOT_STARTED = 'NOT_STARTED',
        IN_PROGRESS = 'IN_PROGRESS',
        SUBMITTED = 'SUBMITTED',
        LOCKED = 'LOCKED',
    }
}

