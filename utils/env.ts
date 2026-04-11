import dotenv from 'dotenv';
dotenv.config();

export const config = {
    BASE_URL: process.env.BASE_URL || 'https://www.automationexercise.com/',
    CREDENTIALS:{
        incorrect_user:{
            email: process.env.INCORRECT_USER || 'IncorrectUser@test.com',
            password: process.env.INCORRECT_PASSWORD || 'IncorrectPass'
        }
    },
    NEW_USER:{

        new_user_name: process.env.NEW_USER_NAME || 'Juan Carlos',
        new_user_day : process.env.NEW_USER_DAY || '15',
        new_user_month: process.env.NEW_USER_MONTH || '7',
        new_user_year: process.env.NEW_USER_YEAR || '1995',
        new_user_first_name: process.env.NEW_USER_FIRST_NAME || 'Juan Carlos',
        new_user_last_name: process.env.NEW_USER_LAST_NAME || 'Bodoque',
        new_user_address1: process.env.NEW_USER_ADDRESS1 || '123 ya casi llegamos',
        new_user_country: process.env.NEW_USER_COUNTRY || 'United States',
        new_user_state: process.env.NEW_USER_STATE || 'New York',
        new_user_city: process.env.NEW_USER_CITY || 'Konoha',
        new_user_zipcode: process.env.NEW_USER_ZIPCODE || '132245',
        new_user_mobile: process.env.NEW_USER_MOBILE || '13246578321',
    }
}