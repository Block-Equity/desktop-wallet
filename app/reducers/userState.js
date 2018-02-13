/* eslint-disable */

import { USER_ACCOUNT } from '../actions/userStateAction';

export default function(state = [], action) {
    if (action.type === USER_ACCOUNT) {
        return action.payload;
    }
}