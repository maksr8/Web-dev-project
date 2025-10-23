import _ from 'lodash';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

function isValid(user, stringKeysToValid) {
    const allChecks = [
        () => _.every(stringKeysToValid, key => {
            const value = _.get(user, key);
            if (!value) {
                return true;
            }
            if (!_.isString(value)) {
                return false;
            }
            const trimmedValue = _.trim(value);
            return trimmedValue.length === 0 || (trimmedValue[0] === trimmedValue[0].toUpperCase());
        }),

        () => _.isNumber(user.age),

        () => {
            const phoneStr = _.get(user, 'phone');
            const phone = parsePhoneNumberFromString(phoneStr || '');
            return phone && phone.isValid();
        },

        () => {
            const emailStr = _.get(user, 'email');
            const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;
            return _.isString(emailStr) && regex.test(emailStr);
        }
    ];
    return _.every(allChecks, check => check());
}

export {
    isValid
};