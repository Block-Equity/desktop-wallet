/* eslint-disable */
import { initUserDB, addUserAccountToDB } from '../store/datastore';
import { accountCreation } from '../network/horizon';

export const USER_ACCOUNT = 'user_account';

export function initDB() {
    return (dispatch) => { 
        initUserDB( (accounts, exists) => {
            if (exists) {
                console.log(`UserAction || Data: Exists`);
                dispatch(setUserAccount(accounts));
            } else {
                accountCreation((accounts) => {
                    console.log(`UserAction || ${JSON.stringify(accounts)}`);
                    dispatch(setUserAccount(accounts));
                });
            }
        });
    };
}

export function setUserAccount(accounts) {
    return {
        type: USER_ACCOUNT,
        payload: accounts
    }
}