/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Admin payload to declare a hackathon winner result
 */
export type DeclareResultDto = {
    /**
     * Submission ID of winning candidate (e.g. HACK-2026-98765)
     */
    submissionId: string;
    /**
     * Declared position
     */
    position: DeclareResultDto.position;
};
export namespace DeclareResultDto {
    /**
     * Declared position
     */
    export enum position {
        FIRST = 'FIRST',
        SECOND = 'SECOND',
        THIRD = 'THIRD',
        CONSOLATION = 'CONSOLATION',
    }
}

