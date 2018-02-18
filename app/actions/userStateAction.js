/* eslint-disable */
export const USER_ACCOUNT = 'user_account';

export function initDB() {
    
}

export function setUserAccount(accounts) {
    return {
        type: USER_ACCOUNT,
        payload: accounts
    }
}