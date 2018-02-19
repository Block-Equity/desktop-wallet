/* eslint-disable */

//Ref: http://www.codereadability.com/how-to-check-for-undefined-in-javascript/
export function isUndefined(value){
    // Obtain `undefined` value that's
    // guaranteed to not have been re-assigned
    var undefined = void(0);
    return value === undefined;
}

export function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}