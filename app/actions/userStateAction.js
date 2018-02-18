/* eslint-disable */
import { initUserDB } from '../store/datastore';
import { createSeed, createTestAccount, getAccountDetail } from '../network/horizon';

export const USER_ACCOUNT = 'user_account';

export function initDB() {
    return (dispatch) => { 
        initUserDB( (accounts, exists) => {
            if (exists) {
                dispatch(setUserAccount(accounts));
            } else {
                networkCalls((publickey, balance, sequence) => {
                    addUserAccount(publicKey, balance, sequence, accounts => {
                        dispatch(setUserAccount(accounts));
                    });
                })
            }
        });
    };
}

function networkCalls(cb) {
    createSeed(publicKey => {
        createTestAccount(publicKey, response => {
            getAccountDetail(publicKey, (balance, sequence) => {
                cb(publickey, balance, sequence);
            });
        }, failure => {
            //TODO: Handle errors please!
        });
    })
}   

export function setUserAccount(accounts) {
    return {
        type: USER_ACCOUNT,
        payload: accounts
    }
}