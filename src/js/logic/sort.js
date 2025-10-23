import _ from 'lodash';

function sortUsersBy(users, key, direction = 'asc') {
    return _.orderBy(users, [key], [direction]);
}

export {
    sortUsersBy
};