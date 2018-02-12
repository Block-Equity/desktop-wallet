/* eslint-disable */

import Store from 'electron-store';
import { isUndefined } from '../utils/utility';

const store = new Store();
const USER_PUBLIC_KEYS = 'userAccountKeys';

export function setAccountKey(publicKey) {
    if (!isUndefined(store.get(USER_PUBLIC_KEYS))) {
        
    } else {
        var keys = [];
        keys.push(publicKey);
        store.set(USER_PUBLIC_KEYS, keys);
    }
}