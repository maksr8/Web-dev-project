function sortUsersBy(users, key, direction = 'asc') {
    const sorted = structuredClone(users);

    sorted.sort((u1, u2) => {
        const val1 = u1[key];
        const val2 = u2[key];

        if (typeof val1 === 'string' && typeof val2 === 'string') {
            const cmp = val1.localeCompare(val2);
            return direction === 'asc' ? cmp : -cmp;
        }

        const numA = key === 'b_date' ? new Date(val1).getTime() : val1;
        const numB = key === 'b_date' ? new Date(val2).getTime() : val2;
        const cmp = numA - numB;
        return direction === 'asc' ? cmp : -cmp;
    });

    return sorted;
}

export {
    sortUsersBy
};