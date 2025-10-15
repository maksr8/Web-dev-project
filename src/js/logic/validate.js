import { parsePhoneNumberFromString } from 'libphonenumber-js';

function isValid(user, stringKeysToValid) {
    for (const key of stringKeysToValid) {
        const val = user[key];
        if (!val) {
            continue;
        }
        if (typeof val !== 'string') {
            return false;
        }
        if (val && val[0] !== val[0].toUpperCase()) {
            return false;
        }
    }
    if (typeof user.age !== 'number') {
        return false;
    }
    const phone = parsePhoneNumberFromString(user.phone);
    if (!phone || !phone.isValid()) {
        return false;
    }
    // example@domain.com
    if (!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(user.email))) {
        return false;
    }

    return true;
}

export {
    isValid
};