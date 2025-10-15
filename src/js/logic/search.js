function searchUsers(users, query) {
    const lowerQuery = String(query).toLowerCase().trim();

    return users.filter(user => {
        for (const key in user) {
            const value = user[key];

            if (typeof value === 'object' && value !== null) {
                continue;
            }

            if (String(value).toLowerCase().includes(lowerQuery)) {
                return true;
            }
        }

        return false;
    });
}

function searchUsersByNameNoteAge(users, query) {
    const lowerQuery = String(query).toLowerCase().trim();

    return users.filter(user => {
        for (const key in user) {
            if (key !== 'full_name' && key !== 'note' && key !== 'age') {
                continue;
            }
            const value = user[key];

            if (String(value).toLowerCase().includes(lowerQuery)) {
                return true;
            }
        }

        return false;
    });
}

export { searchUsers, searchUsersByNameNoteAge };