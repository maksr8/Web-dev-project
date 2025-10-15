let users = [];

function setUsers(newUsers) {
    users = newUsers;
}

function getUsers() {
    return users;
}

function addUser(user) {
    users.push(user);
}

function getTeacherById(id) {
    return users.find(u => String(u.id) === String(id));
}

function getAllCountries() {
    const countries = new Set();
    for (const user of users) {
        if (user.country) {
            countries.add(user.country);
        }
    }
    return Array.from(countries).sort();
}

export { users, setUsers, getUsers, getTeacherById, getAllCountries, addUser };