import _ from 'lodash';

function filterUsersBy(users, filters) {
    const checks = [];

    if (_.has(filters, 'country')) {
        checks.push(user => _.includes(filters.country, user.country));
    }

    if (_.has(filters, 'gender')) {
        checks.push(user => _.includes(filters.gender, user.gender));
    }

    if (_.has(filters, 'favorite')) {
        checks.push(user => _.includes(filters.favorite, user.favorite));
    }

    if (_.has(filters, 'with_picture')) {
        checks.push(user => _.includes(filters.with_picture, !!user.picture_large));
    }

    if (_.has(filters, 'age')) {
        const [first, second] = filters.age;

        if (_.isNumber(first) && _.isUndefined(second)) {
            checks.push(user => user.age === first);
        }
        else if (_.isString(first) && _.isNumber(second)) {
            const opMatch = first.trim().match(/^(>=|<=|>|<|=)$/);
            if (opMatch) {
                checks.push(user => compareNumber(user.age, opMatch[0], second));
            }
        }
        else if (_.isNumber(first) && _.isNumber(second)) {
            checks.push(user => _.inRange(user.age, first, second + 1));
        }
    }

    return _.filter(users, user => _.every(checks, check => check(user)));
}

function compareNumber(value, op, num) {
    switch (op) {
        case '>': return value > num;
        case '<': return value < num;
        case '>=': return value >= num;
        case '<=': return value <= num;
        default: return value === num;
    }
}

export {
    filterUsersBy
};