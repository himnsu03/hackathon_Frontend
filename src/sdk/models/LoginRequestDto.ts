/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Login request payload via email and OTP/Token or Password
 */
export type LoginRequestDto = {
    /**
     * User email address
     */
    email: string;
    /**
     * Verification token / OTP sent to email (preferred over password)
     */
    otp?: string;
    /**
     * User password (optional alternative)
     */
    password?: string;
};

