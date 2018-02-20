/* eslint-disable */
import { initUserDB, addUserAccountToDB } from '../store/datastore';
import { accountCreation } from '../network/horizon';

export const USER_ACCOUNT = 'user_account';
export const CURRENT_USER_WALLET = 'current_user_wallet';

export function initDB() {
    return (dispatch) => { 
        initUserDB( (accounts, exists) => {
            if (exists) {
                console.log(`UserAction || Data: Exists`);
                dispatch(setUserAccount(accounts));
                dispatch(setCurrentUserWallet(Object.keys(accounts)[0]))
            } else {
                accountCreation((accounts) => {
                    console.log(`UserAction || ${JSON.stringify(accounts)}`);
                    dispatch(setUserAccount(accounts));
                    dispatch(setCurrentUserWallet(Object.keys(accounts)[0]))
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

export function setCurrentUserWallet(accountID) {
    return {
        type: CURRENT_USER_WALLET,
        payload: accountID
    }
}