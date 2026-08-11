/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * User profile response object
 */
export type UserResponseDto = {
    /**
     * Unique user ID
     */
    id?: string;
    /**
     * Full name
     */
    name?: string;
    /**
     * Email address
     */
    email?: string;
    /**
     * Phone number
     */
    phoneNumber?: string;
    /**
     * Tech stack
     */
    techStack?: string;
    /**
     * Graduation year
     */
    graduationYear?: number;
    /**
     * College or university
     */
    collegeOrUniversity?: string;
    /**
     * Experience tier
     */
    experience?: UserResponseDto.experience;
    /**
     * Is email verified
     */
    emailVerified?: boolean;
    /**
     * Is mobile verified
     */
    mobileVerified?: boolean;
    /**
     * Agreed to hackathon rules
     */
    agreedToRules?: boolean;
    /**
     * User role
     */
    role?: UserResponseDto.role;
    /**
     * Unique submission ID generated at registration
     */
    submissionId?: string;
};
export namespace UserResponseDto {
    /**
     * Experience tier
     */
    export enum experience {
        STUDENT = 'STUDENT',
        ZERO_TO_ONE = 'ZERO_TO_ONE',
        ONE_TO_THREE = 'ONE_TO_THREE',
        THREE_PLUS = 'THREE_PLUS',
    }
    /**
     * User role
     */
    export enum role {
        CANDIDATE = 'CANDIDATE',
        ADMIN = 'ADMIN',
    }
}

