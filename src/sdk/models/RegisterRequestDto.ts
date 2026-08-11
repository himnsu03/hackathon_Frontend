/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Registration request payload
 */
export type RegisterRequestDto = {
    /**
     * Full name of candidate
     */
    name: string;
    /**
     * User email address
     */
    email: string;
    /**
     * Mobile phone number
     */
    phoneNumber?: string;
    /**
     * Tech stack description or CSV
     */
    techStack?: string;
    /**
     * Graduation year
     */
    graduationYear?: number;
    /**
     * College or university name
     */
    collegeOrUniversity?: string;
    /**
     * Candidate experience level
     */
    experience: RegisterRequestDto.experience;
    /**
     * Agreement to hackathon rules
     */
    agreedToRules: boolean;
    /**
     * Optional password if password login is used
     */
    password?: string;
};
export namespace RegisterRequestDto {
    /**
     * Candidate experience level
     */
    export enum experience {
        STUDENT = 'STUDENT',
        ZERO_TO_ONE = 'ZERO_TO_ONE',
        ONE_TO_THREE = 'ONE_TO_THREE',
        THREE_PLUS = 'THREE_PLUS',
    }
}

