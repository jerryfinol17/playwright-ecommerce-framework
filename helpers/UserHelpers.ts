
import { NEW_USER } from '../pages/config';
import { LoginPage } from '../pages/LoginPage';

export function createUserData() {
    const id = `${Date.now()}_${Math.floor(Math.random() * 9999)}`;
    return {
        ...NEW_USER,
        new_user_email: `testuser_${id}@mailtest.com`,
        new_user_password: `Pass_${id}`,
    };
}

export async function registerUser(loginPage: LoginPage, user: ReturnType<typeof createUserData>) {
    await loginPage.createNewUserFullFlow(
        user.new_user_name,
        user.new_user_email,
        {
            title: 'Mr.',
            password: user.new_user_password,
            day: user.new_user_day,
            month: user.new_user_month,
            year: user.new_user_year,
            firstName: user.new_user_first_name,
            lastName: user.new_user_last_name,
            address1: user.new_user_address1,
            country: user.new_user_country,
            state: user.new_user_state,
            city: user.new_user_city,
            zipcode: user.new_user_zipcode,
            mobile: user.new_user_mobile,
            newsletter: true,
            specialOffers: true,
        }
    );
}