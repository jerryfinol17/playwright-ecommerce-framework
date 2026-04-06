import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export interface ApiResponse<T = unknown> {
    status:       number;
    responseCode: number;
    message:      string;
    data:         T;
    raw:          APIResponse;
}

export abstract class BaseApi {
    protected readonly request: APIRequestContext;
    protected readonly BASE_URL = 'https://automationexercise.com/api';

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    // ==================== HTTP HELPERS ====================

    protected async get<T = unknown>(endpoint: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
        const url    = this.buildUrl(endpoint, params);
        const raw    = await this.request.get(url);
        return this.parseResponse<T>(raw);
    }

    protected async post<T = unknown>(
        endpoint: string,
        body: Record<string, string>,
    ): Promise<ApiResponse<T>> {
        const raw = await this.request.post(`${this.BASE_URL}${endpoint}`, {
            form: body,
        });
        return this.parseResponse<T>(raw);
    }

    protected async put<T = unknown>(
        endpoint: string,
        body: Record<string, string>,
    ): Promise<ApiResponse<T>> {
        const raw = await this.request.put(`${this.BASE_URL}${endpoint}`, {
            form: body,
        });
        return this.parseResponse<T>(raw);
    }

    protected async delete<T = unknown>(
        endpoint: string,
        body: Record<string, string>,
    ): Promise<ApiResponse<T>> {
        const raw = await this.request.delete(`${this.BASE_URL}${endpoint}`, {
            form: body,
        });
        return this.parseResponse<T>(raw);
    }

    // ==================== ASSERTS ====================

    assertStatus(response: ApiResponse, expectedStatus: number): void {
        if (response.status !== expectedStatus) {
            throw new Error(
                `Expected HTTP status ${expectedStatus} but got ${response.status}.\nMessage: ${response.message}`
            );
        }
    }

    assertResponseCode(response: ApiResponse, expectedCode: number): void {
        if (response.responseCode !== expectedCode) {
            throw new Error(
                `Expected responseCode ${expectedCode} but got ${response.responseCode}.\nMessage: ${response.message}`
            );
        }
    }

    assertMessageContains(response: ApiResponse, expectedSubstring: string): void {
        if (!response.message?.toLowerCase().includes(expectedSubstring.toLowerCase())) {
            throw new Error(
                `Expected message to contain "${expectedSubstring}" but got: "${response.message}"`
            );
        }
    }

    assertMessageEquals(response: ApiResponse, expected: string): void {
        expect(response.message).toBe(expected);
    }

    // ==================== PRIVATE HELPERS ====================

    private buildUrl(endpoint: string, params?: Record<string, string>): string {
        const url = new URL(`${this.BASE_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
        }
        return url.toString();
    }

    private async parseResponse<T>(raw: APIResponse): Promise<ApiResponse<T>> {
        let body: Record<string, unknown> = {};

        try {
            body = await raw.json();
        } catch {
            const text = await raw.text().catch(() => '');
            body = { message: text };
        }

        return {
            status:       raw.status(),
            responseCode: (body['responseCode'] as number) ?? raw.status(),
            message:      (body['message'] as string)      ?? '',
            data:         (body as unknown) as T,
            raw,
        };
    }
}
