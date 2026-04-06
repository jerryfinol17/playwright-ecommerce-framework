import { APIRequestContext } from '@playwright/test';
import { BaseApi, ApiResponse } from './BaseApi';
import {
    UserDetailResponse,
    CreateAccountPayload,
    UpdateAccountPayload,
    VerifyLoginPayload,
} from './types/api.types';

export class UserApi extends BaseApi {

    constructor(request: APIRequestContext) {
        super(request);
    }

    // ==================== VERIFY LOGIN ====================

    /**
     * POST /verifyLogin
     * Valid credentials → responseCode 200, message "User exists!"
     * Invalid credentials → responseCode 404, message "User not found!"
     */
    async verifyLogin(payload: VerifyLoginPayload): Promise<ApiResponse> {
        return this.post('/verifyLogin', {
            email:    payload.email,
            password: payload.password,
        });
    }

    /**
     * POST /verifyLogin without any params — expects responseCode 400
     */
    async verifyLoginWithoutParams(): Promise<ApiResponse> {
        return this.post('/verifyLogin', {});
    }

    /**
     * DELETE /verifyLogin — expects responseCode 405 (method not supported)
     */
    async verifyLoginWithDeleteMethod(): Promise<ApiResponse> {
        return this.delete('/verifyLogin', {});
    }

    // ==================== CREATE ACCOUNT ====================

    /**
     * POST /createAccount
     * Creates a new user. Returns responseCode 201, message "User created!"
     */
    async createAccount(payload: CreateAccountPayload): Promise<ApiResponse> {
        return this.post('/createAccount', payload as unknown as Record<string, string>);
    }

    // ==================== UPDATE ACCOUNT ====================

    /**
     * PUT /updateAccount
     * Updates an existing user. Returns responseCode 200, message "User updated!"
     */
    async updateAccount(payload: UpdateAccountPayload): Promise<ApiResponse> {
        return this.put('/updateAccount', payload as unknown as Record<string, string>);
    }

    // ==================== DELETE ACCOUNT ====================

    /**
     * DELETE /deleteAccount
     * Deletes a user by email + password. Returns responseCode 200, message "Account deleted!"
     */
    async deleteAccount(email: string, password: string): Promise<ApiResponse> {
        return this.delete('/deleteAccount', { email, password });
    }

    // ==================== GET USER DETAIL ====================

    /**
     * GET /getUserDetailByEmail
     * Returns full user detail by email.
     */
    async getUserDetailByEmail(email: string): Promise<ApiResponse<UserDetailResponse>> {
        return this.get<UserDetailResponse>('/getUserDetailByEmail', { email });
    }

    // ==================== CONVENIENCE HELPERS ====================

    /**
     * Creates a user and immediately verifies login.
     * Useful as a setup step for UI tests.
     * Returns true if everything went fine.
     */
    async createAndVerify(payload: CreateAccountPayload): Promise<boolean> {
        const created = await this.createAccount(payload);
        if (created.responseCode !== 201) return false;

        const verified = await this.verifyLogin({
            email:    payload.email,
            password: payload.password,
        });
        return verified.responseCode === 200;
    }

    /**
     * Full teardown: deletes a user by email + password.
     * Returns true if deleted successfully.
     */
    async deleteAndVerify(email: string, password: string): Promise<boolean> {
        const deleted = await this.deleteAccount(email, password);
        return deleted.responseCode === 200;
    }
}
