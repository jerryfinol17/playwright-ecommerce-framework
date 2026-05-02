// ==================== PRODUCTS ====================

export interface Product {
    id:       number;
    name:     string;
    price:    string;
    brand:    string;
    category: Category;
}

export interface Category {
    usertype: { usertype: string };
    category: string;
}

export interface ProductsResponse {
    responseCode: number;
    products:     Product[];
}

// ==================== BRANDS ====================

export interface Brand {
    id:   number;
    brand: string;
}

export interface BrandsResponse {
    responseCode: number;
    brands:       Brand[];
}

// ==================== USER ====================

export interface UserDetail {
    id:           number;
    name:         string;
    email:        string;
    title:        string;
    birth_date:   string;
    birth_month:  string;
    birth_year:   string;
    first_name:   string;
    last_name:    string;
    company:      string;
    address1:     string;
    address2:     string;
    country:      string;
    state:        string;
    city:         string;
    zipcode:      string;
}

export interface UserDetailResponse {
    responseCode: number;
    user:         UserDetail;
}

// ==================== ACCOUNT CREATION ====================

export interface CreateAccountPayload {
    name:         string;
    email:        string;
    password:     string;
    title:        'Mr' | 'Mrs' | 'Miss';
    birth_date:   string;
    birth_month:  string;
    birth_year:   string;
    firstname:    string;
    lastname:     string;
    company?:     string;
    address1:     string;
    address2?:    string;
    country:      string;
    zipcode:      string;
    state:        string;
    city:         string;
    mobile_number: string;
}

export interface UpdateAccountPayload extends CreateAccountPayload {}

// ==================== LOGIN ====================

export interface VerifyLoginPayload {
    email:    string;
    password: string;
}
