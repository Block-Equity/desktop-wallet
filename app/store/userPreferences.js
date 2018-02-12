/* eslint-disable */

import Store from 'electron-store';
import { isUndefined } from '../utils/utility';

const store = new Store();
const USER_PUBLIC_KEYS = 'userAccountKeys';

export function setAccountKey(publicKey) {
    var account = store.get(USER_PUBLIC_KEYS);
    if (store.has(USER_PUBLIC_KEYS)) {
        //Subsequent time
        
    } else {
        //First time
        var keys = [];
        keys.push(publicKey);
        store.set(USER_PUBLIC_KEYS, keys);
    }
}