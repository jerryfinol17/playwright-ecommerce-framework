import { APIRequestContext } from '@playwright/test';
import { ProductsApi } from './ProductsApi';
import { UserApi }     from './UserApi';

export class ApiContext {
    readonly products: ProductsApi;
    readonly user:     UserApi;

    constructor(request: APIRequestContext) {
        this.products = new ProductsApi(request);
        this.user     = new UserApi(request);
    }
}
