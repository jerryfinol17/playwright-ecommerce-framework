import dotenv from 'dotenv';
dotenv.config();

export const config = {
    BASE_URL: process.env.BASE_URL || 'https://www.automationexercise.com/',
    CREDENTIALS:{
        regular_user: {
            email: process.env.REGULAR_USER || 'tutia@gmail.com',
            password: process.env.REGULAR_PASSWORD || 'tutia'
        },
    },
}