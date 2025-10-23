import _ from 'lodash';

function searchUsers(users, query) {
    const lowerQuery = _.toLower(_.trim(String(query)));

    if (_.isEmpty(lowerQuery)) {
        return users;
    }

    return _.filter(users, user => {
        return _.some(_.values(user), value => {
            if (_.isObject(value)) {
                return false;
            }
            return _.includes(_.toLower(String(value)), lowerQuery);
        });
    });
}

function searchUsersByNameNoteAge(users, query) {
    const lowerQuery = _.toLower(_.trim(String(query)));

    if (_.isEmpty(lowerQuery)) {
        return users;
    }

    return _.filter(users, user => {
        const fieldsToSearch = _.pick(user, ['full_name', 'note', 'age']);
        return _.some(fieldsToSearch, value => {
            return _.includes(_.toLower(String(value)), lowerQuery);
        });
    });
}

export { searchUsers, searchUsersByNameNoteAge };