function filterUsersBy(users, filters) {
    return users.filter(u => {
        if (filters.country && !filters.country.includes(u.country)) {
            return false;
        }

        if (filters.age) {
            const [first, second] = filters.age;

            if (typeof first === 'number' && second === undefined) {
                if (u.age !== first) {
                    return false;
                }
            } else if (typeof first === 'string' && typeof second === 'number') {
                const opMatch = first.trim().match(/^(>=|<=|>|<|=)$/);
                if (opMatch && !compareNumber(u.age, opMatch[0], second)) {
                    return false;
                }
            } else if (typeof first === 'number' && typeof second === 'number') {
                if (u.age < first || u.age > second) {
                    return false;
                }
            }
        }

        if (filters.gender && !filters.gender.includes(u.gender)) {
            return false;
        }

        if (filters.favorite && !filters.favorite.includes(u.favorite)) {
            return false;
        }

        if (filters.with_picture && !filters.with_picture.includes(!!u.picture_large)) {
            return false;
        }

        return true;
    });
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